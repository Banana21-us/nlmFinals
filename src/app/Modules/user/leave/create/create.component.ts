import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { MatDialogRef } from '@angular/material/dialog';
import { CalendarModule } from 'primeng/calendar';
interface LeaveType {
  id: number;
  type: string;
  days_allowed:Date;
  reason: string;
}

interface dhead {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,ToastModule,ButtonModule,RippleModule,CalendarModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [MessageService]
})
export class CreateComponent implements OnInit{

  leaveTypes: LeaveType[] = [];
  depthead: dhead[] = [];
  dateError: boolean = false; // Flag to show error message 
  minDate: Date = new Date();
  leavereqform = new FormGroup({
    leavetypeid: new FormControl(''),
    from: new FormControl(''),
    to: new FormControl(''),
    reason: new FormControl(''),
    DHead: new FormControl('')
  });

  constructor(private api: ApiService,private messageService: MessageService,private dialogRef: MatDialogRef<CreateComponent>) {}
  
  ngOnInit(): void {
    this.getLeaveTypes();
    this.getdepthead();
    console.log('dhead',this.depthead);
  }

  getLeaveTypes() {
    this.api.getleave().subscribe(data => {
      this.leaveTypes = data;
    });
  }

  getdepthead() {
    this.api.getdepthead().subscribe(data => {
      this.depthead = data;
    });
  }
  close() {
    console.log('Close button clicked');
    this.dialogRef.close(false);
  }
  formatDate(date: string | null | undefined): string {
    if (!date) {
        return ''; // Return a default value or handle appropriately
    }
    const parsedDate = new Date(date);
    return parsedDate.toISOString().slice(0, 19).replace('T', ' '); // Converts to 'YYYY-MM-DD HH:MM:SS'
  }

  onSubmit() {
    const userId = localStorage.getItem('user');
    const fromDate = this.formatDate(this.leavereqform.value.from);
    const toDate = this.formatDate(this.leavereqform.value.to);
    if (new Date(fromDate) > new Date(toDate)) {
        this.dateError = true; // Trigger the error message in the template
        return; // Prevent form submission
    }
    const formData = {
        ...this.leavereqform.value,
        userid: userId,
        from: fromDate,
        to: toDate
    };

    console.log('Form Data:', formData);
    this.api.submitLeaveRequest(formData).subscribe(response => {
        console.log('Leave request submitted:', response);
        this.leavereqform.reset();
        this.dialogRef.close(true); 
        this.showBottomRight();
    });
}


  showBottomRight() {
    this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Account updated successfully', key: 'br', life: 3000 });
}
  
}
