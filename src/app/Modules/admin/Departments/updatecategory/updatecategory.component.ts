import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-updatecategory',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './updatecategory.component.html',
  styleUrl: './updatecategory.component.css'
})
export class UpdatecategoryComponent {

  
  isLoading: boolean = false;

  categformupdate = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private categService: ApiService,
    private dialogRef: MatDialogRef<UpdatecategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the dialog
  ) {}

  ngOnInit(): void {
    console.log('Dialog received data:', this.data.name);
    if (this.data.categoryData) {
      this.categformupdate.patchValue({
        name: this.data.categoryData.name
      });
    }
  }

  update() {
    if (this.categformupdate.valid) {
      this.categService.updatecategory(this.data.categoryData.id, this.categformupdate.value).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating leave:', error);
        }
      });
    }
  }
}