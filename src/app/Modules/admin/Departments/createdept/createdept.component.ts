
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-createdept',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule],
  templateUrl: './createdept.component.html',
  styleUrl: './createdept.component.css'
})
export class CreatedeptComponent {
  
constructor (private department: ApiService, private dialogRef: MatDialogRef<CreatedeptComponent>) {}
  isLoading: boolean = false; 

  deptform = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  register() {
    console.log('Registering user with data:', this.deptform.value); // Log request payload
    this.isLoading = true;
  
    this.department.createdepartment(this.deptform.value).subscribe(
      (result: any) => {
        console.log('submitted successfully:', result);
        this.deptform.reset();
        this.dialogRef.close(true); 
      },
      (error) => {
        console.log('Error:', error); // Log error for more details
        this.isLoading = false;
      }
    );
  }

}
