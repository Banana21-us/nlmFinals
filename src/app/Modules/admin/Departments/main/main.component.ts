
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog
} from '@angular/material/dialog';
// import { CreateComponent } from '../create/create.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

export interface department {
  depart: string;
  designation: string;
  
}
const ELEMENT_DATA: department[] = [
  {depart: 'Administrator', designation: 'Treasurer' }
];
@Component({
  selector: 'app-main',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule,RouterLink, RouterOutlet, RouterModule, ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['depart', 'designation', 'actions'];

  readonly dialog = inject(MatDialog);
  
  
  // openDialog() {
  //   const dialogRef = this.dialog.open(CreateComponent, {
  //     width: '85vw',  // 90% of viewport width
  //     height: '95vh', // 90% of viewport height
  //     maxWidth: '90vw', // Ensures it doesn't exceed 90%
  //     maxHeight: '95vh' // Ensures it doesn't exceed 90%
      
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
