import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-createcategory',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule],
  templateUrl: './createcategory.component.html',
  styleUrl: './createcategory.component.css'
})
export class CreatecategoryComponent {
  
constructor (private categ: ApiService, private dialogRef: MatDialogRef<CreatecategoryComponent>) {}
  isLoading: boolean = false; 

  categform = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  register() {
    console.log('Registering user with data:', this.categform.value); // Log request payload
    this.isLoading = true;
  
    this.categ.createcategory(this.categform.value).subscribe(
      (result: any) => {
        console.log('submitted successfully:', result);
        this.categform.reset();
        this.dialogRef.close(true); 
      },
      (error) => {
        console.log('Error:', error); // Log error for more details
        this.isLoading = false;
      }
    );
  }

}
