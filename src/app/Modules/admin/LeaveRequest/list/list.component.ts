
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../api.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { MessageService, ConfirmationService } from 'primeng/api';

export interface LeaveRequest {
  id: number;
  name: string;
  type: string;
  from: Date;
  to: Date;
  submittedon: Date;
  reason: string;
  dept_head: string;
  exec_sec: string;
  president: string;
}


@Component({
  selector: 'app-list',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule,CommonModule, ButtonModule,
    ToastModule,RippleModule,ConfirmDialog
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [MessageService,ConfirmationService]
})

export class ListComponent implements OnInit {
  constructor(private messageService: MessageService,private leavemanagementService: ApiService, private confirmationService: ConfirmationService) {}
  ngOnInit(): void {
   this.getdata();
  }

dataSource = new MatTableDataSource<LeaveRequest>([]);
  displayedColumns: string[] = ['submittedon','name', 'type', 'from', 'to','reason','dept_head','exec_sec','president','actions'];

  
  getdata(){
    this.leavemanagementService.getLeaveRequestsByexecsec().subscribe(data => {
      this.dataSource.data = data;
      console.log("hell",this.dataSource.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  acceptRequest(element: LeaveRequest) {
    this.confirmationService.confirm({ 
        key: 'acceptDialog',
        header: 'Are you sure?',
        message: 'Please confirm to proceed.',
        accept: () => {
            this.leavemanagementService.acceptexecsec(element.id).subscribe(response => {
                console.log('Request accepted', response);
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Request accepted successfully',
                    life: 3000
                });
                this.getdata(); // Refresh the data after accepting the request
            });
        },
        reject: () => {
            this.messageService.add({ 
                severity: 'info', 
                summary: 'Cancel', 
                detail: 'Action has been canceled' 
            });
        },
    });
}

rejectRequest(element: LeaveRequest) {
  this.confirmationService.confirm({ 
      key: 'declineDialog',
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
          this.leavemanagementService.rejectexecsec(element.id).subscribe(response => {
            console.log('Request rejected', response);
              this.messageService.add({ 
                  severity: 'success', 
                  summary: 'Success', 
                  detail: 'Request declined successfully',
                  life: 3000
              });
              this.getdata(); // Refresh the data after accepting the request
          });
      },
      reject: () => {
          this.messageService.add({ 
              severity: 'info', 
              summary: 'Cancel', 
              detail: 'Action has been canceled' 
          });
      },
  });
}
}





