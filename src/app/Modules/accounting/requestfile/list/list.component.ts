import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateComponent } from '../create/create.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../../../api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UpdateComponent } from '../update/update.component';

@Component({
  selector: 'app-list',
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
export class ListComponent {

  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<any>([]);
  files: any[] = [];
  filteredFiles: any[] = [];

  constructor(private router: Router, private ser: ApiService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getFile();
  }

  getSanitizedHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getFile() {
    this.ser.getFiles().subscribe(data => {
      if (data && typeof data === 'object') {
        // Convert the object to an array
        this.files = Object.values(data);
        this.filteredFiles = this.files; // Initialize filteredFiles with all files
      } else {
        console.error('Unexpected data format:', data);
        this.files = [];
        this.filteredFiles = [];
      }
    });
  }
  

  openDialog(userid?: number, name?: string): void {
    if (userid !== undefined) {
      console.log("Opening dialog for user ID:", userid);
    } else {
      console.log("No user ID found");
    }

    const dialogRef = this.dialog.open(CreateComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: 'auto',
      data: { userid: userid, name: name } // Pass the userid and name
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFile();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!filterValue) {
      this.filteredFiles = this.files; // Show all when input is empty
      return;
    }

    // Check if files is an array before filtering
    if (Array.isArray(this.files)) {
      this.filteredFiles = this.files.filter(file => file.name.toLowerCase().includes(filterValue));
    } else {
      console.error('Cannot filter, files is not an array:', this.files);
      this.filteredFiles = []; // Reset filteredFiles if files is not valid
    }
  }

  onDelete(id: number): void {
    this.ser.deleteFile(id).subscribe({
      next: () => {
        this.files = this.files.filter(ann => ann.id !== id);
        this.filteredFiles = this.files;
        this.getFile();
      }
    });
  }

  onUpdate(element: any) {
        const dialogRef = this.dialog.open(UpdateComponent, {
          width: '90vw',
          height: 'auto',
          maxWidth: '90vw',
          maxHeight: 'auto',
          data: { ann: element } // Pass the entire leave object
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) { 
            this.getFile(); // Refresh data if update was successful
          }
        });
      }
}
