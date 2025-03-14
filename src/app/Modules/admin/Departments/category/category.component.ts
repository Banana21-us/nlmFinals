import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog
} from '@angular/material/dialog';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../../api.service';
import { UpdatedeptComponent } from '../updatedept/updatedept.component';
import { CreateworkstatusComponent } from '../createworkstatus/createworkstatus.component';
import { UpdateworkstatusComponent } from '../updateworkstatus/updateworkstatus.component';
import { CreatecategoryComponent } from '../createcategory/createcategory.component';
import { UpdatecategoryComponent } from '../updatecategory/updatecategory.component';

export interface category {
  id:number;
  name: string;
  
}
@Component({
  selector: 'app-category',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule, ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  readonly dialog = inject(MatDialog);
  readonly workstatusService = inject(ApiService);
  dataSource = new MatTableDataSource<category>([]);
  displayedColumns: string[] = ['name', 'actions'];

  ngOnInit(): void {
    this.getdata();
  }

  getdata(){
    this.workstatusService.getcategory().subscribe(data => {
      this.dataSource.data = data;
    });
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(CreatecategoryComponent, {
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
      const dialogRef = this.dialog.open(UpdatecategoryComponent, {
        width: 'auto',
        height: 'auto',
        data: { categoryData: element } 
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) { 
          this.getdata(); // Refresh data if update was successful
        }
      });
  }

  deletedept(id: number): void {
    this.workstatusService.deletecategory(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}





