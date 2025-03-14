import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-updateworkstatus',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './updateworkstatus.component.html',
  styleUrl: './updateworkstatus.component.css'
})
export class UpdateworkstatusComponent {
  
  isLoading: boolean = false;

  wstatusformupdate = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private wstatusService: ApiService,
    private dialogRef: MatDialogRef<UpdateworkstatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the dialog
  ) {}

  ngOnInit(): void {
    console.log('Dialog received data:', this.data.name);
    if (this.data.workstatusData) {
      this.wstatusformupdate.patchValue({
        name: this.data.workstatusData.name
      });
    }
  }

  update() {
    if (this.wstatusformupdate.valid) {
      this.wstatusService.updateworkstatus(this.data.workstatusData.id, this.wstatusformupdate.value).subscribe({
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