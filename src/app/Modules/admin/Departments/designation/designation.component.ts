
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog
} from '@angular/material/dialog';
// import { CreateComponent } from '../create/create.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CreatedesignationComponent } from '../createdesignation/createdesignation.component';
import { ApiService } from '../../../../api.service';
import { UpdatedesignationComponent } from '../updatedesignation/updatedesignation.component';

export interface designation {
  id:number;
  name: string;
  
}
@Component({
  selector: 'app-designation',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule, ],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css'
})
export class DesignationComponent implements OnInit{
 
  readonly dialog = inject(MatDialog);
  readonly desigmanagementService = inject(ApiService);

  dataSource = new MatTableDataSource<designation>([]);
  displayedColumns: string[] = ['name', 'actions'];

  ngOnInit(): void {
    this.getdata();
  }

  getdata(){
    this.desigmanagementService.getdesignation().subscribe(data => {
      this.dataSource.data = data;
    });
  }
 
  
  openDialog() {
    const dialogRef = this.dialog.open(CreatedesignationComponent, {
      width: '500px',  // 90% of viewport width
      height: 'auto', // 90% of viewport height
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Only call getdata() if the dialog closed after successful submission
        this.getdata();
      }
    });
  }
  deletedesig(id: number): void {
    this.desigmanagementService.deletedesig(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
    });
  }
  
  editdesignation(element: any) {
        const dialogRef = this.dialog.open(UpdatedesignationComponent, {
          width: 'auto',
          height: 'auto',
          data: { designation: element } 
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) { // Only call getdata() if the dialog closed after successful submission
            this.getdata();
          }
        });
    }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}





