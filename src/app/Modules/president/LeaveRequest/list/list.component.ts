
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../api.service';
import { ButtonModule } from 'primeng/button';

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
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule,CommonModule, ButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})

export class ListComponent implements OnInit {
  readonly leavemanagementService = inject(ApiService);
  ngOnInit(): void {
   this.getdata();
  }

dataSource = new MatTableDataSource<LeaveRequest>([]);
displayedColumns: string[] = ['name', 'type', 'from', 'to','submittedon','reason','dept_head','exec_sec','president','actions'];

  
  getdata(){
    this.leavemanagementService.getLeaveRequestsBypresident().subscribe(data => {
      this.dataSource.data = data;
      console.log("hell",this.dataSource.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  acceptRequest(element: LeaveRequest) {
    this.leavemanagementService.acceptpres(element.id).subscribe(response => {
      console.log('Request accepted', response);
      this.getdata(); // Refresh the data after accepting the request
    });
  }

  rejectRequest(element: LeaveRequest) {
    this.leavemanagementService.rejectpres(element.id).subscribe(response => {
      console.log('Request rejected', response);
      this.getdata(); // Refresh the data after accepting the request
    });
  }
}





