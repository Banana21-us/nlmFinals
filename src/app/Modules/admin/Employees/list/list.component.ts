import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog
} from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { ApiService } from '../../../../api.service';
import { CommonModule } from '@angular/common';
import { UpdateComponent } from '../update/update.component';
import { ViewComponent } from '../view/view.component';
import { MessageService, ConfirmationService } from 'primeng/api';

import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';

export interface Employee {
  id: number; // ✅ Added ID field
  img: string;
  nameWithImage: string;
  name: string;
  department: string;
  designation: string;
  phone_number: number;
  email: string;
  status: string;
  reg_approval?: string | null; 
}
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule,ToastModule,ButtonModule,RippleModule,ConfirmDialog],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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


export class ListComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly employeeService = inject(ApiService);
  constructor(private messageService: MessageService,private api: ApiService, private confirmationService: ConfirmationService) {}

  displayedColumns: string[] = ['nameWithImage','department', 'phone_number','email','status', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);

  ngOnInit(): void {
    this.getdata();
  }
  getdata(){
    this.employeeService.getEmployees().subscribe(data => {
      this.dataSource.data = data;
      console.log("hell",this.dataSource.data);
      this.updateStatusOptions();
    });
  }
  statusOptions: { id: number; status: string; color: string }[] = [];

  updateStatusOptions() {
    this.statusOptions = this.dataSource.data.map(emp => ({
      id: emp.id,
      status: emp.reg_approval ? 'ACTIVE' : 'PENDING',
      color: emp.reg_approval ? 'green' : 'red'
    }));
  }

    getStatusText(id: number): string {
    return this.statusOptions.find(opt => opt.id === id)?.status || 'Pending';
  }
  
  getStatusColor(id: number): string {
    return this.statusOptions.find(opt => opt.id === id)?.color || 'red';
  }
  
  viewemployee(element: any): void {
    const dialogRef = this.dialog.open(ViewComponent, {
      width: '95vw',
      height: '85vh',
      maxWidth: '95vw',
      maxHeight: '85vh',// Prevents it from being too tall
      data: { empId: element.id }
       
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Only call getdata() if the dialog closed after successful submission
        this.getdata();
      }
    });
  }
  

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '90vw',
      height: '85vh',
      maxWidth: '90vw',
      maxHeight: '85vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Only call getdata() if the dialog closed after successful submission
        this.getdata();
      }
    });
  }

  editemployee(element: any) {
        const dialogRef = this.dialog.open(UpdateComponent, {
          width: '60vw',
          maxWidth: '60vw',
          height: 'auto',
          maxHeight: '85vh',
          data: { emp: element } 
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) { 
            this.getdata(); // Refresh data if update was successful
          }
        });
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // deleteEmployee(id: number): void {
  //     this.employeeService.deleteEmployee(id).subscribe(() => {
  //       this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
  //     });
  // }
  confirm(id: number) {
    this.confirmationService.confirm({ 
        header: 'Are you sure?',
        message: 'Please confirm to proceed.',
        accept: () => {
            this.employeeService.deleteEmployee(id).subscribe(() => {
              this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
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

