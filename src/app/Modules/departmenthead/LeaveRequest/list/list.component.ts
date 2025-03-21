import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../api.service';
import { ButtonModule } from 'primeng/button';

export interface LeaveRequest {
  id: number;
  user: { name: string };
  leave_type: { type: string };
  from: string;
  to: string;
  created_at: string;
  dept_head: string;
  exec_sec: string;
  reason: string;
  president: string;
}

@Component({
  selector: 'app-list',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, CommonModule, ButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  readonly leavemanagementService = inject(ApiService);
  dataSource = new MatTableDataSource<LeaveRequest>([]);
  displayedColumns: string[] = ['name', 'leave_type', 'from', 'to', 'submittedon', 'reason','dept_head', 'exec_sec','president', 'actions'];

  ngOnInit(): void {
    this.getdata();
  }

  getdata(): void {
    const dheadId = localStorage.getItem('user');
    if (dheadId) {
      const dheadIdNumber = Number(dheadId);
      if (!isNaN(dheadIdNumber)) {
        this.leavemanagementService.getLeaveRequestsByDHead(dheadIdNumber).subscribe(
          (data: any) => {
            // Ensure correct mapping from API response to dataSource
            this.dataSource.data = data.map((item: any) => ({
              id: item.id,
              user: item.user || { name: 'N/A' },
              leave_type: item.leave_type || { type: 'N/A' },
              from: item.from,
              to: item.to,
              created_at: item.created_at,
              dept_head: item.dept_head,
              exec_sec: item.exec_sec,
              president: item.president,
              reason: item.reason,
            }));
          },
          error => {
            console.error('Error fetching leave requests', error);
          }
        );
      } else {
        console.error('Invalid DHead ID in localStorage');
      }
    } else {
      console.error('DHead ID not found in localStorage');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: LeaveRequest, filter: string) =>
      data.user.name.toLowerCase().includes(filter) || 
      data.leave_type.type.toLowerCase().includes(filter);
    this.dataSource.filter = filterValue;
  }

  acceptRequest(element: LeaveRequest) {
    this.leavemanagementService.accept(element.id).subscribe(() => {
      console.log('Request accepted');
      this.getdata();
    });
  }

  rejectRequest(element: LeaveRequest) {
    this.leavemanagementService.reject(element.id).subscribe(() => {
      console.log('Request rejected');
      this.getdata();
    });
  }
}
