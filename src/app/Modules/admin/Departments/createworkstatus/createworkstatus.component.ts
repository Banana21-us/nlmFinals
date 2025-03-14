import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-createworkstatus',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule],
  templateUrl: './createworkstatus.component.html',
  styleUrl: './createworkstatus.component.css'
})
export class CreateworkstatusComponent {

 
constructor (private position: ApiService,private dialogRef: MatDialogRef<CreateworkstatusComponent>) {}
  isLoading: boolean = false; 

 wstatusform = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  register() {
    console.log('Registering user with data:', this.wstatusform.value); // Log request payload
    this.isLoading = true;
  
    this.position.createworkstatus(this.wstatusform.value).subscribe(
      (result: any) => {
        console.log('submitted successfully:', result);
        this.wstatusform.reset();
        this.dialogRef.close(true); 
      },
      (error) => {
        console.log('Error:', error); // Log error for more details
        this.isLoading = false;
      }
    );
  }

}
