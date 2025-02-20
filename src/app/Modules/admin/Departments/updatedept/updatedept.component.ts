import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-updatedept',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './updatedept.component.html',
  styleUrl: './updatedept.component.css'
})
export class UpdatedeptComponent {
  
  isLoading: boolean = false;

  deptformupdate = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private deptService: ApiService,
    private dialogRef: MatDialogRef<UpdatedeptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the dialog
  ) {}

  ngOnInit(): void {
    console.log('Dialog received data:', this.data.leave);
    if (this.data.dept) {
      this.deptformupdate.patchValue({
        name: this.data.dept.name
      });
    }
  }

  update() {
    if (this.deptformupdate.valid) {
      this.deptService.updatedept(this.data.dept.id, this.deptformupdate.value).subscribe({
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