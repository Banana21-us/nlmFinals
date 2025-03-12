import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule,ButtonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  isLoading: boolean = false;
  leaveform = new FormGroup({
    type: new FormControl('', Validators.required),
    days_allowed: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private leaveTypeService: ApiService,
    private dialogRef: MatDialogRef<CreateComponent> // Inject MatDialogRef
  ) {}

  register() {
    console.log('Registering user with data:', this.leaveform.value);
    this.isLoading = true;

    this.leaveTypeService.createLeaveType(this.leaveform.value).subscribe(
      (result: any) => {
        console.log('Submitted successfully:', result);
        this.leaveform.reset();
        this.isLoading = false;
        this.dialogRef.close(true); 
      },
      
      (error) => {
        console.log('Error:', error);
        this.isLoading = false;
      }
    );
  }
}
