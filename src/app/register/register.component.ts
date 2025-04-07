import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone:true,
  styles: [`
    :host ::ng-deep .p-toast {
      width: 335px; /* Adjust width as needed */
      font-size: 0.8rem; /* Adjust font size as needed */
      left: 50%;
      transform: translateX(-50%);
    }

    :host ::ng-deep .p-toast-message-content {
      padding: 0.75rem; /* Adjust padding as needed */
    }

    :host ::ng-deep .p-toast-summary {
      font-weight: bold;
    }
  `],
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule,ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]

})
export class RegisterComponent {

  constructor (private register: ApiService,private messageService: MessageService, private dialogRef: MatDialogRef<RegisterComponent>) {}
  
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
  
  close() {
    console.log('Close button clicked');
    this.dialogRef.close(false);
  }
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
        this.messageService.add({ 
          severity: 'warn', 
          summary: 'Invalid', 
          detail: 'Invalid forms',
          life: 3000
      });
      }
    );
  }
  
}
