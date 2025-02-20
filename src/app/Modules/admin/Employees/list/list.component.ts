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

export interface Employee {
  id: number; // ✅ Added ID field
  name: string;
  department: string;
  designation: string;
  phone_number: number;
  email: string;
  status: string;
}
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class ListComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly employeeService = inject(ApiService);

  displayedColumns: string[] = ['name','department', 'phone_number','email','status', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);

  ngOnInit(): void {
    this.getdata();
  }
  getdata(){
    this.employeeService.getEmployees().subscribe(data => {
      this.dataSource.data = data;
    });
  }
  viewemployee(element: any): void {
    const dialogRef = this.dialog.open(ViewComponent, {
      width: '95vw',
      height: '90vh',
      maxWidth: '95vw',
      maxHeight: '90vh', // Prevents it from being too tall
      data: { empId: element.id }
       
    });
  
    dialogRef.afterClosed().subscribe(result => {
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
          width: 'auto',
          height: 'auto',
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

  deleteEmployee(id: number): void {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
      });
  }
}
