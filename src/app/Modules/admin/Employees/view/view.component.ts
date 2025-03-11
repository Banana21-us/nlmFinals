import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AcceptComponent } from '../accept/accept.component';
import { PrintComponent } from '../print/print.component';

@Component({
  selector: 'app-view',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'] // Fixed the issue here
})
export class ViewComponent implements OnInit {
  employee: any;

  constructor(
    private users: ApiService,
    private dialogRef: MatDialogRef<ViewComponent>, 
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const employeeId = this.data.empId;
    if (employeeId) {
      this.users.getEmployee(employeeId).subscribe(
        (data) => {
          this.employee = data;
          console.log('Employee data:', this.employee);
        },
        (error) => {
          console.error('Error fetching employee data', error);
        }
      );
    }
  }

  acceptemployee(element: any) {
    if (!element) {
      console.error("Employee data is undefined!");
      return;
    }
    const dialogRef = this.dialog.open(AcceptComponent, {
      width: '70vw',
      height: 'auto',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }

  printemployee(element: any) {
    if (!element) {
      console.error("Employee data is undefined!");
      return;
    }
    const dialogRef = this.dialog.open(PrintComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { employee: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }
}
