
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog
} from '@angular/material/dialog';
// import { CreateComponent } from '../create/create.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CreatedesignationComponent } from '../createdesignation/createdesignation.component';
import { ApiService } from '../../../../api.service';
import { UpdatedesignationComponent } from '../updatedesignation/updatedesignation.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

export interface designation {
  id:number;
  name: string;
  
}
@Component({
  selector: 'app-designation',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule, 
    ToastModule,ButtonModule,RippleModule,ConfirmDialog
  ],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css',
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
export class DesignationComponent implements OnInit{
 
  readonly dialog = inject(MatDialog);
  constructor(private messageService: MessageService,private desigmanagementService: ApiService, private confirmationService: ConfirmationService) {}

  dataSource = new MatTableDataSource<designation>([]);
  displayedColumns: string[] = ['name', 'actions'];

  ngOnInit(): void {
    this.getdata();
  }

  getdata(){
    this.desigmanagementService.getdesignation().subscribe(data => {
      this.dataSource.data = data;
    });
  }
 
  
  openDialog() {
    const dialogRef = this.dialog.open(CreatedesignationComponent, {
      width: '500px',  // 90% of viewport width
      height: 'auto', // 90% of viewport height
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Only call getdata() if the dialog closed after successful submission
        this.getdata();
      }
    });
  }
  
  
  editdesignation(element: any) {
        const dialogRef = this.dialog.open(UpdatedesignationComponent, {
          width: 'auto',
          height: 'auto',
          data: { designation: element } 
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) { // Only call getdata() if the dialog closed after successful submission
            this.getdata();
          }
        });
    }

    confirm(id: number) {
      this.confirmationService.confirm({ 
          header: 'Are you sure?',
          message: 'Please confirm to proceed.',
          accept: () => {
            this.desigmanagementService.deletedesig(id).subscribe(() => {
              this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
            
                  this.messageService.add({ 
                      severity: 'success', 
                      summary: 'Success', 
                      detail: 'Deleted successfully',
                      life: 3000
                  });
                 // Refresh the list after deletion
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
      this.getdata(); 
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}





