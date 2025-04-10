import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog
} from '@angular/material/dialog';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CreatedeptComponent } from '../createdept/createdept.component';
import { ApiService } from '../../../../api.service';
import { UpdatedeptComponent } from '../updatedept/updatedept.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

export interface departments {
  id:number;
  name: string;
}

@Component({
  selector: 'app-dept',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule,
     ToastModule,ButtonModule,RippleModule,ConfirmDialog
   ],
  templateUrl: './dept.component.html',
  styleUrl: './dept.component.css',
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
export class DeptComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  constructor(private messageService: MessageService,private DeptmanagementService: ApiService, private confirmationService: ConfirmationService) {}
  
  dataSource = new MatTableDataSource<departments>([]);
  displayedColumns: string[] = ['name', 'actions'];

  ngOnInit(): void {
    this.getdata();
  }

  getdata(){
    this.DeptmanagementService.getdepartment().subscribe(data => {
      this.dataSource.data = data;
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreatedeptComponent, {
      width: '90%',  // 90% of viewport width
      height: 'auto', // 90% of viewport height
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Only call getdata() if the dialog closed after successful submission
        this.getdata();
      }
    });
  }

  editdept(element: any) {
      const dialogRef = this.dialog.open(UpdatedeptComponent, {
        width: 'auto',
        height: 'auto',
        data: { dept: element } 
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
          this.DeptmanagementService.deletedept(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
          
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Deleted successfully',
                    life: 3000
                });
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
}





