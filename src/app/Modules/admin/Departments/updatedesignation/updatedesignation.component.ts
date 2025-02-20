import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-updatedesignation',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './updatedesignation.component.html',
  styleUrl: './updatedesignation.component.css'
})
export class UpdatedesignationComponent {


  isLoading: boolean = false;

  designationformupdate = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private desigService: ApiService,
    private dialogRef: MatDialogRef<UpdatedesignationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the dialog
  ) {}

  ngOnInit(): void {
    console.log('Dialog received data:', this.data.leave);
    if (this.data.designation) {
      this.designationformupdate.patchValue({
        name: this.data.designation.name
      });
    }
  }

  update() {
    if (this.designationformupdate.valid) {
      this.desigService.updatedesignation(this.data.designation.id, this.designationformupdate.value).subscribe({
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