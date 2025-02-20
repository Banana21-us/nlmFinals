import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CreateComponent } from '../create/create.component';
import { MatDialog } from '@angular/material/dialog';

export interface LeaveRequest {
  type: string;
  from: Date;
  to: Date;
  submittedon: Date;
  status: string;
}

const ELEMENT_DATA: LeaveRequest[] = [
  { 
    type: 'Paternity Leave', 
    from: new Date(2024, 1, 9),  // February 9, 2024
    to: new Date(2024, 1, 15),   // February 15, 2024
    submittedon: new Date(2024, 0, 2),
    status: 'Pending' 
  }
];

@Component({
  selector: 'app-list',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule,CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})

export class ListComponent {
  readonly dialog = inject(MatDialog)

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['type', 'from', 'to','submittedon','status','actions'];
  // dialog: any;

  openDialog() {
      const dialogRef = this.dialog.open(CreateComponent, {
        width: 'auto',
        height: 'auto',
      });
    
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result) {
      //     this.getdata();
      //   }
      // });
    }
  getdata() {
    throw new Error('Method not implemented.');
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}





