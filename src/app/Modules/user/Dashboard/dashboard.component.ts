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

  currentDate: Date = new Date();
  activeSection: string = 'dashboard'; 

  constructor(private dashboard: ApiService) {}

  ngOnInit(): void {
    this.fetchCounts();
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





}