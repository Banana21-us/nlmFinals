import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
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
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  

  appl: number = 0;
  appr: number = 0;
  rej: number = 0;
  tdl: number = 0;
  emp: number = 0;
  ann: number = 0;

  pending = 0;
  approved = 0;
  rejected = 0;
  eventsToday = 0;  
  
  currentDate: Date = new Date();
  activeSection: string = 'dashboard'; 

  constructor(private dashboard: ApiService) {}

  ngOnInit(): void {
    this.fetchCounts();
    this.countleavedash();
  }

  fetchCounts() {
    this.dashboard.getCounts().subscribe({
      next: (response) => {
        this.emp = response.total_users;
        this.ann = response.total_announcements;
      },
      error: (error) => {
        console.error('Error fetching counts', error);
      }
    });
  }
  countleavedash(){
    const userId = localStorage.getItem('user') ?? '';
    
    if (userId) {
      this.dashboard.countleavedash(userId).subscribe(response => {
        this.pending = response.pending;
        this.approved = response.approved;
        this.rejected = response.rejected;
        this.eventsToday = response.events_today;
      }, error => {
        console.error('Error fetching dashboard data:', error);
      });
    } else {
      console.error('User ID is null or undefined!');
    }
  }





}