import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-update',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule,CommonModule,FormsModule,ToastModule,MatSelectModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css',
    providers: [MessageService]
  
})
export class UpdateComponent implements OnInit{
  
  isLoading: boolean = false;
  departments: any[] = [];
  positions: any[] = [];
  designations: any[] = [];
  category: any[] = [];
  workstat: any[] = [];

  empformupdate = new FormGroup({
    department: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    designation: new FormControl('', Validators.required),
    work_status: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    reg_approval: new FormControl('', Validators.required),
    email : new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.minLength(8))
  });

  constructor(
    private empService: ApiService,
    private dialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Inject the data passed to the dialog
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.getdept();
    console.log('Dialog received data:', this.data.emp);
    if (this.data.emp) {
      this.empformupdate.patchValue({
        department: this.data.emp.department,
        position: this.data.emp.position,
        designation: this.data.emp.designation,
        email: this.data.emp.email,
        category: this.data.emp.category,
        work_status: this.data.emp.work_status,
        reg_approval: this.data.emp.reg_approval,
      });
    }
  }
  getdept(){
    this.empService.getdepartment().subscribe(data => {
      this.departments = data;
    });
    this.empService.getposition().subscribe(data => {
      this.positions = data;
    });

    this.empService.getdesignation().subscribe(data => {
      this.designations = data;
    });

    this.empService.getcategory().subscribe(data => {
      this.category = data;
    });

    this.empService.getworkstatus().subscribe(data => {
      this.workstat = data;
    });
  }

  update() {
    if (this.empformupdate.valid) {
      const formData = this.empformupdate.value;
    
      const positionValue = Array.isArray(formData.position)
        ? formData.position.join(', ')
        : formData.position;
    
      const filteredData = Object.fromEntries(
        Object.entries({ ...formData, position: positionValue })
          .filter(([key, value]) => value !== '' && value !== null)
      );
    
      this.empService.updateemp(this.data.emp.id, filteredData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          console.error('Error updating employee:', error);
        }
      });
    
    }
  }

}