import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CreateComponent } from '../create/create.component';
import { MatDialog } from '@angular/material/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../../api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { UpdateComponent } from '../update/update.component';
export interface LeaveRequest {
  id: number;
  type: string;
  from: Date;
  to: Date;
  submittedon: Date;
  reason: string;
  exec_sec: string;
  president: string;
}


@Component({
  selector: 'app-list',
  standalone:true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule,CommonModule,ToastModule,ButtonModule,RippleModule,ConfirmDialog],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [MessageService,ConfirmationService]
  
})

export class ListComponent implements OnInit{
  readonly dialog = inject(MatDialog)
  dataSource = new MatTableDataSource<LeaveRequest>([]);
  displayedColumns: string[] = ['type', 'from', 'to','submittedon','reason','exec_sec','president','actions'];
  element: any;
  leaveRequests:any;
  constructor(private messageService: MessageService,private api: ApiService,private confirmationService: ConfirmationService) {}
  ngOnInit(): void {
    this.getdata();
  }

  confirm(id: number) {
    this.confirmationService.confirm({
        header: 'Are you sure?',
        message: 'Please confirm to proceed.',
        accept: () => {
            this.api.deleteLeaveRequest(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(LeaveRequest => LeaveRequest.id !== id);
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
  
    
  openDialog() {
      const dialogRef = this.dialog.open(CreateComponent, {
        width: '90vw',
        height: '85vh',
        maxHeight: '85vh',
        maxWidth: '90vw'
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.showBottomRight();
          this.getdata();
        }
      });
    }
    
    edits(element: any) {
      const dialogRef = this.dialog.open(UpdateComponent, {
        width: '90vw',
        height: '85vh',
        maxHeight: '85vh',
        maxWidth: '90vw',
        data: { emp: element } 
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Updated successfully',
            life: 3000
        });
      
        }
        this.getdata();
      }
      
    );
      

    }
    getdata() {
      const userId: string | null = localStorage.getItem('user');
      if (userId) {
          this.api.getLeaveRequestsByUserId(userId).subscribe((data: any[]) => {
              const formattedData = data.map(item => ({
                  id: item.id,
                  type: item.leave_type?.type || 'N/A',
                  from: new Date(item.from),  
                  to: new Date(item.to),  
                  submittedon: new Date(item.created_at), 
                  reason: item.reason,
                  exec_sec: item.exec_sec,
                  president: item.president
              }));
  
              this.dataSource.data = formattedData;
              console.log('Formatted Leave Requests:', formattedData);
          });
      } else {
          console.error("User ID is null");
      }
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  showBottomRight() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leave request submitted successfully', key: 'br', life: 3000 });
  }

}





