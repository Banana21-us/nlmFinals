import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { MatDialogRef } from '@angular/material/dialog';
import { CalendarModule } from 'primeng/calendar';
import { LeaveBalance,LeaveBalanceResponse } from '../../../../api.service';

interface LeaveType {
  id: number;
  type: string;
  days_allowed: Date;
  reason: string;
}

interface dhead {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ToastModule, ButtonModule, RippleModule, CalendarModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [MessageService]
})
export class CreateComponent implements OnInit {

  leaveTypes: LeaveType[] = [];
  depthead: dhead[] = [];
  dateError: boolean = false;
  remainingDaysError: boolean = false;
  minDate: Date = new Date();
  calculatedDays: number = 0;
  selectedLeaveTypeId: number | null = null;
  remainingDays: number = 0;

  leavereqform = new FormGroup({
    leavetypeid: new FormControl('', [Validators.required]),
    from: new FormControl('', [Validators.required]),
    to: new FormControl('', [Validators.required]),
    reason: new FormControl('', [Validators.required]),
    DHead: new FormControl('', [Validators.required])
  });

  leaveBalances: LeaveBalance[] = [];
  yearsOfService = 0;
  hide: boolean = true;
  
  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private dialogRef: MatDialogRef<CreateComponent>
  ) {}

  ngOnInit(): void {
    this.getLeaveTypes();
    this.getdepthead();
    this.getLeaveBalance();

    // Listen for date changes to calculate days
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
  getLeaveTypes() {
    this.api.getleave().subscribe(data => {
      this.leaveTypes = data;
    });
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
        this.yearsOfService = res.years_of_service;
        this.updateRemainingDays();
      },
      error: (err) => {
        console.error('Error fetching leave balances', err);
      }
    });
  }

  getdepthead() {
    this.api.getdepthead().subscribe(data => {
      this.depthead = data;
    });
  }

  close() {
    this.dialogRef.close(false);
  }

  formatDate(date: string | null | undefined): string {
    if (!date) {
      return '';
    }
    const parsedDate = new Date(date);
    return parsedDate.toISOString().slice(0, 19).replace('T', ' ');
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

  updateRemainingDays() {
    if (this.selectedLeaveTypeId === null || !this.leaveBalances.length) {
      this.remainingDays = 0;
      return;
    }

    const balance = this.leaveBalances.find(b => b.type_id === this.selectedLeaveTypeId);
    this.remainingDays = balance ? balance.remaining : 0;
  }

  validateRemainingDays() {
    this.remainingDaysError = this.calculatedDays > this.remainingDays;
  }

  onSubmit() {
    // Validate all fields
    if (this.leavereqform.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    // Get the selected leave type ID
    const selectedLeaveTypeId = Number(this.leavereqform.value.leavetypeid);
    
    // Validate dates
    const fromDate = new Date(this.leavereqform.value.from!);
    const toDate = new Date(this.leavereqform.value.to!);
    
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

    // Find the corresponding leave balance
    
    const balance = this.getBalanceForLeaveType(this.selectedLeaveTypeId!);
    
    if (!balance) {
      const leaveTypeName = this.leaveTypes.find(t => t.id === selectedLeaveTypeId)?.type || 'selected';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Could not find leave balance information for ${leaveTypeName} leave`
      });
      return;
    }

    // Validate remaining days
    if (requestedDays > balance.remaining) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `You only have ${balance.remaining} remaining days for ${balance.type} (Requested: ${requestedDays})`
      });
      return;
    }
    // Proceed with submission if all validations pass
    const userId = localStorage.getItem('user');
    const formData = {
      ...this.leavereqform.value,
      userid: userId,
      from: this.formatDate(this.leavereqform.value.from),
      to: this.formatDate(this.leavereqform.value.to)
    };

    this.api.submitLeaveRequest(formData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave request submitted successfully'
        });
        this.leavereqform.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
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
  // Helper method to get leave type name by ID
  getLeaveTypeName(id: number): string {
    const leaveType = this.leaveTypes.find(t => t.id === id);
    if (leaveType) return leaveType.type;
    
    const balance = this.leaveBalances.find(b => b.type_id === id);
    return balance ? balance.type : 'Unknown';
  }
}