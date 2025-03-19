import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
// import { ConnectService } from '../../../connect.service';
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
import { UpdateComponent } from '../update/update.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
// import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatExpansionModule,CommonModule,
    ReactiveFormsModule, RouterModule,FormsModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule
  ,ToastModule,ButtonModule,RippleModule,ConfirmDialog],
    
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [MessageService,ConfirmationService]
  
})
export class ListComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<any>([]);

  announcements: any[] = [];
  filteredAnnouncements: any[] = []; // New filtered array

  constructor(private router: Router, private ser: ApiService,private sanitizer: DomSanitizer,private messageService: MessageService,private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.getdata();
  }
  getSanitizedHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  getdata() {
    this.ser.getAnnouncements().subscribe(data => {
      this.announcements = data;
      this.dataSource.data = this.announcements; // Initialize dataSource with announcements
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: 'auto',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getdata();
      }
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
          this.getdata(); // Refresh data if update was successful
        }
      });
    }
    confirm(id: number) {
      this.confirmationService.confirm({ 
          header: 'Are you sure?',
          message: 'Please confirm to proceed.',
          accept: () => {
            this.ser.deleteAnnouncement(id).subscribe(() => {
              next: () => {
                this.announcements = this.announcements.filter(ann => ann.id !== id);
                this.dataSource.data = this.announcements; 
                this.filteredAnnouncements = this.filteredAnnouncements.filter(ann => ann.id !== id);
              }
            
                  this.messageService.add({ 
                      severity: 'success', 
                      summary: 'Success', 
                      detail: 'Deleted successfully',
                      life: 3000
                  });
                  this.getdata(); // Refresh the list after deletion
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
}
