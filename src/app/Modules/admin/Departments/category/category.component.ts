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
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

export interface category {
  id:number;
  name: string;
  
}
@Component({
  selector: 'app-category',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, RouterModule,
    ToastModule,ButtonModule,RippleModule,ConfirmDialog
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  providers: [MessageService,ConfirmationService],
  styles: [`
    :host ::ng-deep .p-toast {
      width: 335px; /* Adjust width as needed */
      font-size: 0.8rem; /* Adjust font size as needed */
      left: 50%;
      margin-left: 30px; /* Adjust top position as needed */
      transform: translateX(-50%);
    }

    :host ::ng-deep .p-toast-message-content {
      padding: 0.75rem; /* Adjust padding as needed */
    }

    :host ::ng-deep .p-toast-summary {
      font-weight: bold;
    }
  `],
})
export class CategoryComponent {

  readonly dialog = inject(MatDialog);
  constructor(private messageService: MessageService,private category: ApiService, private confirmationService: ConfirmationService) {}

  dataSource = new MatTableDataSource<category>([]);
  displayedColumns: string[] = ['name', 'actions'];

  ngOnInit(): void {
    this.getdata();
  }

  getdata(){
    this.category.getcategory().subscribe(data => {
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
  editcateg(element: any) {
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
  confirm(id: number) {
    this.confirmationService.confirm({ 
        header: 'Are you sure?',
        message: 'Please confirm to proceed.',
        accept: () => {
          this.category.deletecategory(id).subscribe(() => {
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





