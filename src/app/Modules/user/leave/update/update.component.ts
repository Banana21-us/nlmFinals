import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
@Component({
  selector: 'app-update',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,MatDialogModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit {
  
  leaveTypes:any;

  gettype() {
    this.ser.getleave().subscribe(data => {
      this.leaveTypes = data;
    });
  }
  updateleavereqform = new FormGroup({
    leavetypeid: new FormControl(''),
    from: new FormControl(''),
    to: new FormControl(''),
    reason: new FormControl('')
  });
  empformupdate: any;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any , private ser: ApiService) {}

  ngOnInit(): void {
    console.log('Dialog received data:', this.data.emp);
    this.gettype();
    this.updateleavereqform.patchValue({
      leavetypeid: this.data.emp.leavetypeid,
      from: this.formatDate(this.data.emp.from),
      to: this.formatDate(this.data.emp.to),
      reason: this.data.emp.reason
    });
  }
  
  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.updateleavereqform.valid) {
      console.log(this.updateleavereqform.value);
      this.ser.updatedetails(this.data.emp.id, this.updateleavereqform.value).subscribe({
        next: () => {
          this.dialogRef.close(true);
        }
      });
    }
    
  }
  close() {
    console.log('Close button clicked');
    this.dialogRef.close(false);
  }
      
  }

