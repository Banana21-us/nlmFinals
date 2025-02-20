
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-accept',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.css'
})
export class AcceptComponent {

  isLoading: boolean = false;
  departments: any[] = [];
  positions: any[] = [];
  designations: any[] = [];

  acceptform = new FormGroup({
    department: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    designation: new FormControl('', Validators.required),
  });

  constructor(
    private empService: ApiService,
    private dialogRef: MatDialogRef<AcceptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the dialog
  ) {}
  ngOnInit(): void {
    this.getdept();
    
    console.log('Dialog received datass:', this.data);
    if (this.data) {
      this.acceptform.patchValue({
        department: this.data.department,
        position: this.data.position,
        designation: this.data.designation,
      });
    }
  }
  getdept(){
    this.empService.getdepartment().subscribe(data => {
      this.departments = data;
    });
    this.empService.getdesignation().subscribe(data => {
      this.positions = data;
    });

    this.empService.getposition().subscribe(data => {
      this.designations = data;
    });
  }

  accept() {
    if (this.acceptform.invalid) {
      console.error("Form is invalid", this.acceptform.errors);
      return;
    }
  
    const employeeId = this.data.employee.id; // ✅ Correctly extract ID
    const payload = this.acceptform.value;
  
    this.empService.acceptemployee(employeeId, payload).subscribe(
      response => {
        console.log("Employee updated successfully:", response);
        this.dialogRef.close(true);
      },
      error => {
        console.error("Error updating employee:", error);
      }
    );
  }
  
}