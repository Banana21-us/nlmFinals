
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-accept',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule,MatSelectModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.css'
})
export class AcceptComponent {

  isLoading: boolean = false;
  departments: any[] = [];
  positions: any[] = [];
  designations: any[] = [];
  category: any[] = [];
  work_status: any[] = [];

  acceptform = new FormGroup({
    department: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    designation: new FormControl('', Validators.required),
    work_status: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    
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
        designation: this.data.designation,
        position: this.data.position,
        work_status: this.data.work_status,
        category: this.data.category
       
      });
    }
  }
  getdept(){
    this.empService.getdepartment().subscribe(data => {
      this.departments = data;
    });
    this.empService.getdesignation().subscribe(data => {
      
      this.designations = data;
    });

    this.empService.getposition().subscribe(data => {
      this.positions = data;
    });

    this.empService.getcategory().subscribe(data => {
      this.category = data;
    });

    this.empService.getworkstatus().subscribe(data => {
      this.work_status = data;
    });
  }


  accept() {
    if (this.acceptform.invalid) {
      console.error("Form is invalid", this.acceptform.errors);
      return;
    }
  
    const employeeId = this.data.employee.id; // ✅ Correctly extract ID
    const positionValue = Array.isArray(this.acceptform.value.position) 
    ? this.acceptform.value.position.join(', ') 
    : this.acceptform.value.position;

  const payload = {
    ...this.acceptform.value,
    position: positionValue
  };
  
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