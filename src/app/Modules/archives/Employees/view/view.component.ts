import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-view',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{
  constructor (private users: ApiService,
     private dialogRef: MatDialogRef<ViewComponent>, 
     private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  readonly dialog = inject(MatDialog);
  employee: any = {};
    education: any[] = [];
    employment: any[] = [];
    employees: any[] = [];
    spouse: any[] = [];
    employfamily: any[] = [];



  ngOnInit(): void {
    console.log('Employee reg_approval:', this.employee?.reg_approval);
    
    const employeeId = this.data.empId;
      if (employeeId) {
        this.users.getEmployee(employeeId).subscribe(
          (data: any) => {
            this.employee = data;
            this.education = data.education ?? [];
            this.employment = data.employment ?? [];
            this.spouse = data.spouse ?? [];
            this.employfamily = data.employfamily ?? [];
            console.log('Employee data:', this.employee);
          },
          (error) => {
            console.error('Error fetching employee data', error);
          }
        );
      }
  }

  printemployee() {
    const img = new Image();
    img.src = "black.png";  // public storage

    img.onload = () => {
        if (!this.employee) {
            console.error("No employee data to print.");
            return;
        }
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            console.log('Data being printed:', this.employee);
            printWindow.document.write(`
                <html>
                <head>
                  <title>Workers Profile ${new Date().getFullYear()}</title>
                  <style>
                    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                    .container { width: 100%; max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .header-left {
                          position: relative;
                        }
                        .header-left img.logo {
                          position: absolute;
                          top: -55px; /* Adjust this to move the logo upward */
                          left: 0;
                          width: 100px;
                          height: auto;
                        }
                    .header h2, .header h3 { margin: 0; padding: 0; }
                    .header p { font-size: 14px; }
                    .details, .education, .employment { width: 100%; border-collapse: collapse;}
                    .details th, .education th, .employment th, .details td, .education td, .employment td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                    .details th, .education th, .employment th { background-color: #f4f4f4; }
                    @media print { .btn-info { display: none; } }
                  </style>
                </head>
                <body>
                  <div class="container">
                        <div class="header">
                          <div class="header-left">
                            <img src="${img.src}" class="logo" style="width: 100px; height: 100px;">                  
                          </div>
                          <div class="header-right">
                            <h2>NORTHERN LUZON MISSION</h2>
                          </div>
                        </div>
                    <div class="section">
                      <table class="details">
                      
                        <tr><td>Full Name:</td><td>${this.employee.employee?.name ?? "N/A"}</td></tr>
                        <tr><td>Date of Birth:</td><td>${this.employee.employee?.birthdate ?? "N/A"}</td></tr>
                        <tr><td>Place of Birth:</td><td>${this.employee.employee?.birthplace ?? "N/A"}</td></tr>
                        <tr><td>Residence/Address:</td><td>${this.employee.employee?.address ?? "N/A"}</td></tr>
                        <tr><td>Telephone Number:</td><td>${this.employee.employee?.phone_number ?? "N/A"}</td></tr>
                        <tr><td>Email Address:</td><td>${this.employee.employee?.email ?? "N/A"}</td></tr>
                      </table>
                    </div>
                    <div class="section">
                      <h3>Education</h3>
                      <table class="education">
                        <tr><th>Level</th><th>Year</th><th>School</th><th>Degree</th></tr>
                        ${this.education?.length > 0 ? this.education.map((edu: any) => `
                          <tr>
                            <td>${edu.levels ?? "N/A"}</td>
                            <td>${edu.year ?? "N/A"}</td>
                            <td>${edu.school ?? "N/A"}</td>
                            <td>${edu.degree ?? "N/A"}</td>
                          </tr>
                        `).join('') : `<tr><td colspan="4">No education records found.</td></tr>`}
                      </table>
                    </div>
                    <div class="section">
                      <h3>Employment</h3>
                      <table class="employment">
                        <tr><th>Position</th><th>Date</th><th>Organization/Institution</th></tr>
                        ${this.employment?.length > 0 ? this.employment.map((emp: any) => `
                          <tr>
                            <td>${emp.position ?? "N/A"}</td>
                            <td>${emp.dateofemp ?? "N/A"}</td>
                            <td>${emp.organization ?? "N/A"}</td>
                          </tr>
                        `).join('') : `<tr><td colspan="3">No employment records found.</td></tr>`}
                      </table>
                    </div>

                    <div class="section">
                      <h3>Spouse</h3>
                      <table class="employment">
                        <tr><th>Name</th><th>Date</th></tr>
                        ${this.spouse?.length > 0 ? this.spouse.map((sp: any) => `
                          <tr>
                            <td>${sp.name ?? "N/A"}</td>
                            <td>${sp.dateofmarriage ?? "N/A"}</td>
                          </tr>
                        `).join('') : `<tr><td colspan="3">No spouse records found.</td></tr>`}
                      </table>
                    </div>

                    <div class="section">
                      <h3>Children</h3>
                      <table class="employment">
                        <tr><th>Name</th><th>Date</th><th>Career</th></tr>
                        ${this.employfamily?.length > 0 ? this.employfamily.map((ch: any) => `
                          <tr>
                            <td>${ch.children ?? "N/A"}</td>
                            <td>${ch.dateofbirth ?? "N/A"}</td>
                            <td>${ch.career ?? "N/A"}</td>
                          </tr>
                        `).join('') : `<tr><td colspan="3">No children records found.</td></tr>`}
                      </table>
                    </div>
                  </div>
                </body>
                </html>
              `);
            printWindow.document.close();
            printWindow.print();
            printWindow.close();
        }
    };

    img.onerror = () => {
        console.error("Failed to load image.");
    };
}
  
  
}
