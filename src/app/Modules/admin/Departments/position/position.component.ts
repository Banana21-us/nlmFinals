

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
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

export interface position {
  id:number;
  name: string;
  
}

@Component({
  selector: 'app-position',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule,
     ToastModule,ButtonModule,RippleModule,ConfirmDialog
   ],
  templateUrl: './position.component.html',
  styleUrl: './position.component.css',
  providers: [MessageService,ConfirmationService]
})
export class PositionComponent implements OnInit{
 
  readonly dialog = inject(MatDialog);
  constructor(private messageService: MessageService,private positionmanagementService: ApiService, private confirmationService: ConfirmationService) {}

  dataSource = new MatTableDataSource<position>([]);
  displayedColumns: string[] = ['name', 'actions'];

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

  confirm(id: number) {
    this.confirmationService.confirm({ 
        header: 'Are you sure?',
        message: 'Please confirm to proceed.',
        accept: () => {
          this.positionmanagementService.deletepos(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
          
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Deleted successfully',
                    life: 3000
                });
               // Refresh the list after deletion
            });
        },
        reject: () => {
            this.messageService.add({ 
                severity: 'info', 
                summary: 'Cancel', 
                detail: 'Deletion has been canceled' 
            });
        },
        
    }); this.getdata(); 
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





