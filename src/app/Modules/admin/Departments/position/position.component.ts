

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
import { CreatepositionComponent } from '../createposition/createposition.component';
import { ApiService } from '../../../../api.service';
import { UpdatepositionComponent } from '../updateposition/updateposition.component';

export interface position {
  id:number;
  name: string;
  salary: string;
  
}

@Component({
  selector: 'app-position',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule, ],
  templateUrl: './position.component.html',
  styleUrl: './position.component.css'
})
export class PositionComponent implements OnInit{
 
  readonly dialog = inject(MatDialog);
  readonly positionmanagementService = inject(ApiService);
  
  dataSource = new MatTableDataSource<position>([]);
  displayedColumns: string[] = ['name', 'salary', 'actions'];

  ngOnInit(): void {
    this.getdata();
  }

  getdata(){
    this.positionmanagementService.getposition().subscribe(data => {
      this.dataSource.data = data;
    });
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(CreatepositionComponent, {
      width: '500px',  // 90% of viewport width
      height: 'auto', // 90% of viewport height
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Only call getdata() if the dialog closed after successful submission
        this.getdata();
      }
    });
  }

  deletepos(id: number): void {
    this.positionmanagementService.deletepos(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
    });
  }

  editposition(element: any) {
          const dialogRef = this.dialog.open(UpdatepositionComponent, {
            width: 'auto',
            height: 'auto',
            data: { pos: element } 
          });
        
          dialogRef.afterClosed().subscribe(result => {
            if (result) { 
              this.getdata(); // Refresh data if update was successful
            }
          });
      }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}





