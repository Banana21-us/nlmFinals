import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor (private register: ApiService, private dialogRef: MatDialogRef<RegisterComponent>) {}
  
  isLoading: boolean = false; 
  departments: any[] = [];
  positions: any[] = [];
  designations: any[] = [];


  userform = new FormGroup({
    name: new FormControl('', Validators.required),
    birthdate: new FormControl('', Validators.required),
    birthplace: new FormControl('', Validators.required),
    phone_number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    address : new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  registers() {
    console.log('Registering user with data:', this.userform.value); // Log request payload
    this.isLoading = true;
  
    this.register.postusers(this.userform.value).subscribe(
      (result: any) => {
        console.log('submitted successfully:', result);
        this.userform.reset();
        this.dialogRef.close(true); 
      },
      (error) => {
        console.log('Error:', error); // Log error for more details
        this.isLoading = false;
        
      }
    );
  }
  
}
