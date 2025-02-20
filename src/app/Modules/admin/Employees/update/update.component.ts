import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-update',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit{
  
  isLoading: boolean = false;
  departments: any[] = [];
  positions: any[] = [];
  designations: any[] = [];

  empformupdate = new FormGroup({
    department: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    designation: new FormControl('', Validators.required),
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private empService: ApiService,
    private dialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the dialog
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
  }

  update() {
      console.log('Updating emp with ID:', this.data.emp.id);
      this.empService.updateemp(this.data.emp.id, this.empformupdate.value).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating employee:', error);
        }
      });
  }
}