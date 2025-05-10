import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';

interface LeaveBalance {
  type: string;
  allowed: number;
  used: number;
  remaining: number;
}

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, ToastModule, CalendarModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css',
  providers: [MessageService]
})
export class UpdateComponent implements OnInit {
  leaveTypes: any;
  leaveBalances: LeaveBalance[] = [];
  minDate: Date = new Date();
  calculatedDays: number = 0;
  dateError: boolean = false;

  updateleavereqform = new FormGroup({
    leavetypeid: new FormControl('', [Validators.required]),
    from: new FormControl<Date | null>(null, [Validators.required]),
    to: new FormControl<Date | null>(null, [Validators.required]),
    reason: new FormControl('', [Validators.required])
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ser: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    console.log('Dialog received data:', this.data.emp);
    this.gettype();
    this.getLeaveBalance();
    
    this.updateleavereqform.patchValue({
      leavetypeid: this.data.emp.leavetypeid,
      from: this.parseDate(this.data.emp.from),
      to: this.parseDate(this.data.emp.to),
      reason: this.data.emp.reason
    });
  }

  gettype() {
    this.ser.getleave().subscribe(data => {
      this.leaveTypes = data;
    });
  }

  getLeaveBalance() {
    const storedUser = localStorage.getItem('users');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const userId = user?.id;
    if (!userId) return;

    this.ser.getLeaveBalances(userId).subscribe({
      next: (res: any) => {
        this.leaveBalances = res.balances;
      },
      error: (err) => {
        console.error('Error fetching leave balances', err);
      }
    });
  }

  parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  formatDateForApi(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateDays() {
    const fromDate = this.updateleavereqform.value.from;
    const toDate = this.updateleavereqform.value.to;

    if (fromDate && toDate) {
      this.dateError = false;
      
      if (fromDate > toDate) {
        this.dateError = true;
        this.calculatedDays = 0;
        return;
      }

      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      this.calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
      this.calculatedDays = 0;
    }
  }

  getBalanceForLeaveType(leaveTypeId: number): LeaveBalance | undefined {
    const leaveType = this.leaveTypes.find((t: any) => t.id === leaveTypeId);
    if (!leaveType) return undefined;

    return this.leaveBalances.find(b => 
      b.type.toLowerCase() === leaveType.type.toLowerCase()
    );
  }

  onSubmit(): void {
    if (this.updateleavereqform.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    const formValue = this.updateleavereqform.value;
    const selectedLeaveTypeId = Number(formValue.leavetypeid);
    const fromDate = formValue.from;
    const toDate = formValue.to;

    // Date validation
    if (!fromDate || !toDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select valid dates'
      });
      return;
    }

    if (fromDate > toDate) {
      this.dateError = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'End date must be after start date'
      });
      return;
    }

    // Calculate requested days
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Leave balance validation
    const balance = this.getBalanceForLeaveType(selectedLeaveTypeId);
    
    if (!balance) {
      const leaveTypeName = this.leaveTypes.find((t: any) => t.id === selectedLeaveTypeId)?.type || 'selected';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Could not find leave balance information for ${leaveTypeName} leave`
      });
      return;
    }

    if (requestedDays > balance.remaining) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `You only have ${balance.remaining} remaining days for ${balance.type} (Requested: ${requestedDays})`
      });
      return;
    }

    // Prepare data for API
    const apiData = { 
      ...formValue,
      leavetypeid: selectedLeaveTypeId,
      from: this.formatDateForApi(fromDate),
      to: this.formatDateForApi(toDate)
    };

    this.ser.updatedetails(this.data.emp.id, apiData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave request updated successfully'
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update leave request'
        });
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}