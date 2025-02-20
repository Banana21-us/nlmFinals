import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-createposition',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule],
  templateUrl: './createposition.component.html',
  styleUrl: './createposition.component.css'
})
export class CreatepositionComponent {
 
constructor (private position: ApiService,private dialogRef: MatDialogRef<CreatepositionComponent>) {}
  isLoading: boolean = false; 

  positionsform = new FormGroup({
    name: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),
  });

  register() {
    console.log('Registering user with data:', this.positionsform.value); // Log request payload
    this.isLoading = true;
  
    this.position.createposition(this.positionsform.value).subscribe(
      (result: any) => {
        console.log('submitted successfully:', result);
        this.positionsform.reset();
        this.dialogRef.close(true); 
      },
      (error) => {
        console.log('Error:', error); // Log error for more details
        this.isLoading = false;
      }
    );
  }

}
