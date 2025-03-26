import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
// import { Chart, registerables } from 'chart.js';
// import { ConnectService } from '../../../connect.service';
import { CommonModule } from '@angular/common';
// import { Router } from 'express';
import { RouterLink, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../api.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
// Register all necessary components of Chart.js
// Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,ToastModule,ProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {
  
  pu: number = 0;
  emp: number = 0;
  ann: number = 0;
  penexec: number = 0;
  todayEvents: number = 0;
  totalLeaveDays: number = 0;
  currentDate: Date = new Date();
  activeSection: string = 'dashboard'; 
  userId: number = Number(localStorage.getItem('user')); 

  value: number = 0;
  interval: any;
  id: any;
  accountData: any;
  constructor(private dashboard: ApiService,private ngZone: NgZone,private messageService: MessageService) {}

  ngOnInit(): void {
    this.fetchCounts();
    this.execpendingleave();
    this.loadDashboardData();
    console.log(this.loadDashboardData);
    this.bar();
    this.loadAccountDetails();
  }
  bar() {
    this.ngZone.runOutsideAngular(() => {
        this.interval = setInterval(() => {
            this.ngZone.run(() => {
                this.value = this.calculateProgress();
                });
        }, 2000);
    });
}

loadAccountDetails(): void {
    const id = localStorage.getItem('user');
    this.id = id;
    this.dashboard.getAccountDetails(this.id).subscribe({
        next: (response) => {
            this.accountData = response.data; // Access the 'data' property
            console.log('Account Details:', this.accountData);
            this.value = this.calculateProgress();
        },
    });
}

calculateProgress(): number {
    let totalFields = 0;
    let filledFields = 0;

    function countFields(obj: any, parentPath = '') {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const fieldPath = parentPath ? `${parentPath}.${key}` : key;
                totalFields++;

                console.log(`Checking field: ${fieldPath}, Value: ${value}, Filled: ${checkValue(value)}`);
                if (!checkValue(value)) {
                    console.warn(`⚠️ MISSING FIELD: ${fieldPath} is considered empty!`);
                }
                
                if (typeof value === 'object' && value !== null) {
                    if (Array.isArray(value)) {
                        if (value.length > 0) {
                            filledFields++; // Count non-empty arrays
                        }
                    } else {
                        countFields(value, fieldPath); // Recursively check nested objects
                        filledFields++; // Count non-null objects (like spouse)
                    }
                } else {
                    if (checkValue(value)) {
                        filledFields++;
                    }
                }
            }
        }
    }

    function checkValue(value: any): boolean {
        return value !== null && value !== undefined && value !== '';
    }

    if (this.accountData) {
        countFields(this.accountData);
    }

    console.log(`Total Fields: ${totalFields}, Filled Fields: ${filledFields}, Progress: ${Math.round((filledFields / totalFields) * 100)}%`);
    return Math.round((filledFields / totalFields) * 100);
  }

  fetchCounts() {
    this.dashboard.getCounts().subscribe({
      next: (response) => {
        this.emp = response.approved_users;
        this.pu = response.pending_users;
        this.ann = response.total_announcements;
      },
      error: (error) => {
        console.error('Error fetching counts', error);
      }
    });
  }

  execpendingleave() {
    this.dashboard.leavecount().subscribe({
      next: (response) => {
        this.penexec = response.pending_exec_sec;
      },
      error: (error) => {
        console.error('Error fetching counts', error);
      }
    });
  }

  loadDashboardData(): void {
    this.dashboard.getDashboardData(this.userId).subscribe(response => {
      this.todayEvents = response.today_events;
      this.totalLeaveDays = response.total_leave_days;
    });
  }
}