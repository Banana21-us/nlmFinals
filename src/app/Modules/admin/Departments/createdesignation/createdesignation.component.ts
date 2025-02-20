import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-createdesignation',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule],
  templateUrl: './createdesignation.component.html',
  styleUrl: './createdesignation.component.css'
})
export class CreatedesignationComponent {
  
constructor (private designation: ApiService,private dialogRef: MatDialogRef<CreatedesignationComponent>) {}
  isLoading: boolean = false; 

  desigform = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  register() {
    console.log('Registering user with data:', this.desigform.value); // Log request payload
    this.isLoading = true;
  
    this.designation.createdesignation(this.desigform.value).subscribe(
      (result: any) => {
        console.log('submitted successfully:', result);
        this.desigform.reset();
        this.dialogRef.close(true); 
      },
      (error) => {
        console.log('Error:', error); // Log error for more details
        this.isLoading = false;
      }
    );
  }

}
