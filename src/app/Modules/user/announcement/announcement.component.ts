import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
// import { ConnectService } from '../../../connect.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../../api.service';
@Component({
  selector: 'app-announcement',
  imports: [MatExpansionModule,CommonModule,
    ReactiveFormsModule, RouterModule,FormsModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule],  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent {

  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<any>([]);

  announcements: any[] = [];
  filteredAnnouncements: any[] = []; // New filtered array

  constructor(private router: Router, private ser: ApiService) {}

  ngOnInit(): void {
    this.getdata();
  }

  getdata() {
    this.ser.getAnnouncements().subscribe(data => {
      this.announcements = data;
      this.dataSource.data = this.announcements; // Initialize dataSource with announcements
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.filteredAnnouncements = this.announcements.filter(ann => 
      ann.title.toLowerCase().includes(filterValue) || 
      ann.announcement.toLowerCase().includes(filterValue)
    );
  }
  

  onDelete(id: number): void {
      this.ser.deleteAnnouncement(id).subscribe({
        next: () => {
          this.announcements = this.announcements.filter(ann => ann.id !== id);
          this.dataSource.data = this.announcements; 
          this.filteredAnnouncements = this.filteredAnnouncements.filter(ann => ann.id !== id);
        }
      });
    
  }


  
}
