import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-update',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit {
  
  isLoading: boolean = false;

  leaveformupdate = new FormGroup({
    type: new FormControl('', Validators.required),
    days_allowed: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private leaveTypeService: ApiService,
    private dialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the dialog
  ) {}

  ngOnInit(): void {
    console.log('Dialog received data:', this.data.leave);
    if (this.data.leave) {
      this.leaveformupdate.patchValue({
        type: this.data.leave.type,
        days_allowed: this.data.leave.days_allowed,
        description: this.data.leave.description
      });
    }
  }

  update() {
    if (this.leaveformupdate.valid) {
      console.log('Updating leave with ID:', this.data.leave.id);
      this.leaveTypeService.updateLeave(this.data.leave.id, this.leaveformupdate.value).subscribe({
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