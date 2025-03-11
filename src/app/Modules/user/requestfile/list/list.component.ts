import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../../../api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatExpansionModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<any>([]);
  files: any[] = [];
  filteredFiles: any[] = [];

  constructor(private router: Router, private ser: ApiService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('user'));
    this.getFile(userId);
  }

  getSanitizedHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getFile(userId: number) {
    this.ser.getrecordsByUserId(userId).subscribe(data => {
      if (data && typeof data === 'object') {
        // Convert the object to an array
        this.files = Object.values(data);
        this.filteredFiles = this.files; // Initialize filteredFiles with all files
        this.dataSource.data = this.files; // Update MatTableDataSource
      } else {
        console.error('Unexpected data format:', data);
        this.files = [];
        this.filteredFiles = [];
        this.dataSource.data = []; // Reset MatTableDataSource
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!filterValue) {
      this.filteredFiles = this.files; // Show all when input is empty
      this.dataSource.data = this.files; // Update MatTableDataSource
      return;
    }

    // Check if files is an array before filtering
    if (Array.isArray(this.files)) {
      this.filteredFiles = this.files.filter(file => file.name?.toLowerCase().includes(filterValue));
      this.dataSource.data = this.filteredFiles; // Update MatTableDataSource
    } else {
      console.error('Cannot filter, files is not an array:', this.files);
      this.filteredFiles = []; // Reset filteredFiles if files is not valid
      this.dataSource.data = []; // Reset MatTableDataSource
    }
  }
}
