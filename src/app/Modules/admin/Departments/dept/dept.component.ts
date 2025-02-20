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

export interface departments {
  id:number;
  name: string;
  
}

@Component({
  selector: 'app-dept',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule, ],
  templateUrl: './dept.component.html',
  styleUrl: './dept.component.css'
})
export class DeptComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  readonly DeptmanagementService = inject(ApiService);
  
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

  deletedept(id: number): void {
    this.DeptmanagementService.deletedept(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}





