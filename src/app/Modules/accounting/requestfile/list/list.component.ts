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
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
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
    MatButtonModule,
    ButtonModule,
    ToastModule,ConfirmDialog,DialogModule,InputTextModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [MessageService,ConfirmationService],
  styles: [`
    :host ::ng-deep .p-toast {
      width: 335px; /* Adjust width as needed */
      font-size: 0.8rem; /* Adjust font size as needed */
      left: 50%;
      margin-left: 30px; /* Adjust top position as needed */
      transform: translateX(-50%);
    }

    :host ::ng-deep .p-toast-message-content {
      padding: 0.75rem; /* Adjust padding as needed */
    }

    :host ::ng-deep .p-toast-summary {
      font-weight: bold;
    }
  `],
  
})
export class ListComponent {
  visible: boolean = false;
  accCode: string = '';
  userId: number = 1;
  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<any>([]);
  files: any[] = [];
  filteredFiles: any[] = [];
  selectedFiles: File[] = [];

  constructor(private router: Router, private ser: ApiService, private sanitizer: DomSanitizer, private messageService: MessageService, private confirmationService: ConfirmationService) { }


  showDialog(userId: number, currentAccCode: string | null) {
    this.userId = userId;
    this.accCode = currentAccCode || ''; // If null, set as empty string
    this.visible = true;
  }
  
  saveAccCode() {
    if (!this.accCode) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Account code is required' });
      return;
    }

    this.ser.storeOrUpdateAccCode(this.userId, this.accCode).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.visible = false;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update account code' });
      }
    );
  }

  onFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  submit() {
    if (this.selectedFiles.length === 0) {
        this.messageService.add({ 
          severity: 'info', 
          summary: 'Invalid', 
          detail: 'Please select files to upload.',
          life: 3000
      });
    }
  
    this.ser.uploadFiles(this.selectedFiles).subscribe(
      response => {
        console.log('Upload successful', response);
        
        // Clear selected files and reset file input
        this.selectedFiles = [];
        
        // Reset the file input field to allow re-selection of the same files
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        this.getFile();
      },
      error => console.error('Upload failed', error)
    );
  }
  
  
  
  ngOnInit(): void {
    this.getFile();
    console.log(this.filteredFiles)
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

  // onDelete(id: number): void {
  //   this.ser.deleteFile(id).subscribe({
  //     next: () => {
  //       this.files = this.files.filter(ann => ann.id !== id);
  //       this.filteredFiles = this.files;
  //       this.getFile();
  //     }
  //   });
  // }
  confirm(id: number) {
      this.confirmationService.confirm({ 
          header: 'Are you sure?',
          message: 'Please confirm to proceed.',
          accept: () => {
            this.ser.deleteFile(id).subscribe(() => {
              next: () => {
                this.files = this.files.filter(ann => ann.id !== id);
                this.filteredFiles = this.files;
                this.messageService.add({ 
                  severity: 'success', 
                  summary: 'Success', 
                  detail: 'Deleted successfully',
                  life: 3000
              });
              
              }
            
              this.getFile();// Refresh the list after deletion
              });
          },
          reject: () => {
              this.messageService.add({ 
                  severity: 'info', 
                  summary: 'Cancel', 
                  detail: 'Deletion has been canceled' 
              });
          },
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
