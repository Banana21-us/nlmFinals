
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
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

export interface workstatus {
  id:number;
  name: string;
  
}

@Component({
  selector: 'app-workstatus',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule, 
     ToastModule,ButtonModule,RippleModule,ConfirmDialog
  ],
  templateUrl: './workstatus.component.html',
  styleUrl: './workstatus.component.css',
  providers: [MessageService,ConfirmationService]
})
export class WorkstatusComponent {

  readonly dialog = inject(MatDialog);
  constructor(private messageService: MessageService,private workstatusService: ApiService, private confirmationService: ConfirmationService) {}

  dataSource = new MatTableDataSource<workstatus>([]);
  displayedColumns: string[] = ['name', 'actions'];

  ngOnInit(): void {
    this.getdata();
  }

  getdata(){
    this.workstatusService.getworkstatus().subscribe(data => {
      this.dataSource.data = data;
    });
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(CreateworkstatusComponent, {
      width: '90%',  // 90% of viewport width
      height: 'auto', // 90% of viewport height
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Only call getdata() if the dialog closed after successful submission
        this.getdata();
      }
    });
  }
  editorkstat(element: any) {
      const dialogRef = this.dialog.open(UpdateworkstatusComponent, {
        width: 'auto',
        height: 'auto',
        data: { workstatusData: element } 
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) { 
          this.getdata(); // Refresh data if update was successful
        }
      });
  }

  confirm(id: number) {
    this.confirmationService.confirm({ 
        header: 'Are you sure?',
        message: 'Please confirm to proceed.',
        accept: () => {
          this.workstatusService.deleteworkstatus(id).subscribe(() => {
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}





