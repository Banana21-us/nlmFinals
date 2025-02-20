import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AcceptComponent } from '../accept/accept.component';
// import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-view',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{
  constructor (private users: ApiService,
     private dialogRef: MatDialogRef<ViewComponent>, 
     private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  readonly dialog = inject(MatDialog);
  employee: any;

 acceptemployee(element: any) {
  if (!element) {
    console.error("Employee data is undefined!");
    return;
  }
          const dialogRef = this.dialog.open(AcceptComponent, {
            width: '70vw',
            height: 'auto',
            maxWidth: '70vw',
            maxHeight: 'auto',
            data: element
          });
        
          dialogRef.afterClosed().subscribe(result => {
            if (result) { 
              // this.getdata(); 
            }
          });
}

  ngOnInit(): void {
    const employeeId = this.data.empId;
    if (employeeId) {
      this.users.getEmployee(employeeId).subscribe(
        (data) => {
          this.employee = data;
          console.log('Employee data:', this.employee); // Debugging
        },
        (error) => {
          console.error('Error fetching employee data', error);
        }
      );
    }
  }

  printSection(containerId: string) {
    let content = document.getElementById(containerId)?.innerHTML;
    let printWindow = window.open('', '', 'width=800,height=600');
    
    if (printWindow && content) {
      printWindow.document.write(`
        <html>
        
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
              @media print {
              .card {
                border: none; /* Remove border for cleaner print */
              }
              .row {
                display: flex !important; /* Force columns to be inline */
                flex-wrap: nowrap !important; /* Prevent wrapping */
                 gap: 15px;
              }
              .print-col {
                flex: 1; /* Equal width for all columns */
                padding: 5px !important;
                font-size: 12px; /* Reduce font size for print */
                // text-align: center;
              }
            }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  }
  
  
}
