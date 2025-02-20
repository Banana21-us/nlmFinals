import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-updateposition',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './updateposition.component.html',
  styleUrl: './updateposition.component.css'
})
export class UpdatepositionComponent {

  isLoading: boolean = false;

  posformupdate = new FormGroup({
    name: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),

  });

  constructor(
    private posService: ApiService,
    private dialogRef: MatDialogRef<UpdatepositionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the dialog
  ) {}

  ngOnInit(): void {
    if (this.data.pos) {
      this.posformupdate.patchValue({
        name: this.data.pos.name,
        salary: this.data.pos.salary
      });
    }
  }

  update() {
    if (this.posformupdate.valid) {
      this.posService.updatepos(this.data.pos.id, this.posformupdate.value).subscribe({
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