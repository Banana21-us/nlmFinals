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
import { LeaveBalance, LeaveBalanceResponse } from '../../../../api.service';

interface LeaveType {
  id: number;
  type: string;
  days_allowed: Date;
  reason: string;
}
interface YearsOfService {
  years: number;
  months: number;
  summary: string;
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ToastModule, ButtonModule, RippleModule, CalendarModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [MessageService]
})
export class CreateComponent implements OnInit {

  leaveTypes: LeaveType[] = [];
  minDate: Date = new Date(); // Current date, to disable past dates
  dateError: boolean = false; // Flag to show error message 
  leavereqform = new FormGroup({
    leavetypeid: new FormControl(''),
    from: new FormControl(''),
    to: new FormControl(''),
    reason: new FormControl('')
  });

  calculatedDays: number = 0;
  selectedLeaveTypeId: number | null = null;
  remainingDaysError: boolean = false;
  remainingDays: number = 0;
  leaveBalances: LeaveBalance[] = [];

  years_of_service: YearsOfService | null = null;

  hide: boolean = true;

  constructor(private api: ApiService, private messageService: MessageService, private dialogRef: MatDialogRef<CreateComponent>) {}

  ngOnInit(): void {
    this.getLeaveTypes();
    this.getLeaveBalance();
    
    // Add value change subscriptions
    this.leavereqform.get('from')?.valueChanges.subscribe(() => this.calculateDays());
    this.leavereqform.get('to')?.valueChanges.subscribe(() => this.calculateDays());
    this.leavereqform.get('leavetypeid')?.valueChanges.subscribe((id) => {
      this.selectedLeaveTypeId = id ? Number(id) : null;
      this.updateRemainingDays();
      this.validateRemainingDays();
    });
  }

  toggleHide(): void {
    this.hide = !this.hide;
  }

  calculateDays() {
    const fromDate = this.leavereqform.value.from;
    const toDate = this.leavereqform.value.to;

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      
      // Reset date error flag
      this.dateError = false;
      
      if (from > to) {
        this.dateError = true;
        this.calculatedDays = 0;
        return;
      }

      // Calculate difference in days (including both start and end dates)
      const diffTime = Math.abs(to.getTime() - from.getTime());
      this.calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
      
      this.validateRemainingDays();
    } else {
      this.calculatedDays = 0;
    }
  }

  validateRemainingDays() {
    this.remainingDaysError = this.calculatedDays > this.remainingDays;
  }

  getLeaveBalance() {
    const storedUser = localStorage.getItem('users');
    if (!storedUser) {
      console.error('User not found in localStorage');
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user?.id;

    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    this.api.getLeaveBalances(userId).subscribe({
        next: (res: LeaveBalanceResponse) => {
          this.leaveBalances = res.balances;
          // If res.years_of_service is a number, convert it to YearsOfService structure
          if (typeof res.years_of_service === 'number') {
            this.years_of_service = {
              years: res.years_of_service,
              months: 0,
              summary: `${res.years_of_service} years`
            };
          } else {
            this.years_of_service = res.years_of_service;
          }
          this.updateRemainingDays();
        },
     
      error: (err) => {
        console.error('Error fetching leave balances', err);
      }
    });
  }

  updateRemainingDays() {
    if (this.selectedLeaveTypeId === null || !this.leaveBalances.length) {
      this.remainingDays = 0;
      return;
    }

    const balance = this.getBalanceForLeaveType(this.selectedLeaveTypeId);
    this.remainingDays = balance ? balance.remaining : 0;
  }

  getLeaveTypes() {
    this.api.getleave().subscribe(data => {
      this.leaveTypes = data;
    });
  }

  close() {
    console.log('Close button clicked');
    this.dialogRef.close(false);
  }

  // formatDate(date: string | null | undefined): string {
  //   if (!date) {
  //       return ''; // Return a default value or handle appropriately
  //   }
  //   const parsedDate = new Date(date);
  //   return parsedDate.toISOString().slice(0, 19).replace('T', ' '); // Converts to 'YYYY-MM-DD HH:MM:SS'
  // }
formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    // Format as YYYY-MM-DD HH:MM:SS without timezone conversion
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} 12:00:00`;
  }
  onSubmit() {
    const userId = localStorage.getItem('user');

    // Validate all required fields
    if (this.leavereqform.invalid) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please fill all required fields'
        });
        return;
    }

    // Format the dates first
    const fromDate = this.formatDate(this.leavereqform.value.from);
    const toDate = this.formatDate(this.leavereqform.value.to);

    // Check if the 'From' date is after the 'To' date
    if (new Date(fromDate) > new Date(toDate)) {
        this.dateError = true;
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'End date must be after start date'
        });
        return;
    }

    // Calculate requested days
    const diffTime = Math.abs(new Date(toDate).getTime() - new Date(fromDate).getTime());
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Get selected leave type ID
    const selectedLeaveTypeId = Number(this.leavereqform.value.leavetypeid);
    
    // Validate leave balance
    const balance = this.getBalanceForLeaveType(selectedLeaveTypeId);
    
    if (!balance) {
        const leaveTypeName = this.leaveTypes.find(t => t.id === selectedLeaveTypeId)?.type || 'selected';
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Could not find leave balance information for ${leaveTypeName} leave`
        });
        return;
    }

    // Check remaining days
    if (requestedDays > balance.remaining) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `You only have ${balance.remaining} remaining days for ${balance.type} (Requested: ${requestedDays})`
        });
        return;
    }

    // If all validations pass, proceed with submission
    const formData = {
        ...this.leavereqform.value,
        userid: userId,
        from: fromDate,
        to: toDate
    };

    console.log('Form Data:', formData);
    this.api.submitLeaveRequest(formData).subscribe({
        next: (response) => {
            console.log('Leave request submitted:', response);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Leave request submitted successfully'
            });
            this.leavereqform.reset();
            this.dialogRef.close(true);
            this.showBottomRight();
        },
        error: (error) => {
            console.error('Error submitting leave request:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to submit leave request'
            });
        }
    });
  }

  getBalanceForLeaveType(leaveTypeId: number): LeaveBalance | undefined {
    // First find the leave type name for this ID
    const leaveType = this.leaveTypes.find(t => t.id === leaveTypeId);
    if (!leaveType) return undefined;

    // Then find the balance that matches this type name
    return this.leaveBalances.find(b => 
      b.type.toLowerCase() === leaveType.type.toLowerCase()
    );
  }

  showBottomRight() {
    this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Account updated successfully', key: 'br', life: 3000 });
  }
}