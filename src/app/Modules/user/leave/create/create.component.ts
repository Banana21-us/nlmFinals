import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { MatDialogRef } from '@angular/material/dialog';

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
  imports: [CommonModule,ReactiveFormsModule,FormsModule,ToastModule,ButtonModule,RippleModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [MessageService]
})
export class CreateComponent implements OnInit{

  leaveTypes: LeaveType[] = [];
  depthead: dhead[] = [];

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

  onSubmit() {
    const userId = localStorage.getItem('user');
    const formData = {
      ...this.leavereqform.value,
      userid: userId
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
