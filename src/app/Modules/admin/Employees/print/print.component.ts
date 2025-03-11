import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../api.service';

@Component({
  selector: 'app-print',
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule,CommonModule,],
  templateUrl: './print.component.html',
  styleUrl: './print.component.css'
})
export class PrintComponent implements OnInit {

  employee: any = {
    employee: {
      address: "",
      birthdate: "",
      birthplace: "",
      department: "",
      designation: "",
      email: "",
      gender: "",
      name: "",
      phone_number: "",
      position: "",
      reg_approval: "",
      status: ""
    },
    education: [],
    employfamily: [],
    employment: [],
    spouse: []
  };

  
  constructor(private users: ApiService,
       private dialogRef: MatDialogRef<PrintComponent>, 
       private route: ActivatedRoute,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

      ngOnInit(): void {
        this.data = this.data;
        console.log('Datsssa:', this.data);
        // console.log('Employee reg_approval:', this.employee?.reg_approval);
        
        // const employeeId = this.data.empId;
        // if (employeeId) {
        //   this.users.getEmployee(employeeId).subscribe(
        //     (data) => {
        //       this.employee = data;
        //       console.log('Employee data:', this.employee); // Debugging
        //     },
        //     (error) => {
        //       console.error('Error fetching employee data', error);
        //     }
        //   );
        // }
        
      }

      printSection(containerId: string) {
        // Get the content of the container using its ID
        let content = document.getElementById(containerId)?.innerHTML;
      
        // Open a new print window
        let printWindow = window.open('', '', 'width=800,height=600');
      
        if (printWindow && content) {
          printWindow.document.write(`
        <html>
        <head>
          <title>Print Worker Profile</title>
          <style>
            body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
            }
            .container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
            }
            .header {
          text-align: center;
          margin-bottom: 20px;
            }
            .header h2, .header h3 {
          margin: 0;
          padding: 0;
            }
            .header p {
          font-size: 14px;
          margin-top: 5px;
            }
            .section {
          margin-bottom: 20px;
            }
            .details {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
            }
            .details th, .details td {
          padding: 8px;
          text-align: left;
          border: 1px solid #ddd;
            }
            .details th {
          background-color: #f4f4f4;
            }
            .education, .employment {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
            }
            .education th, .employment th, .education td, .employment td {
          padding: 8px;
          text-align: left;
          border: 1px solid #ddd;
            }
            .education th, .employment th {
          background-color: #f4f4f4;
            }
            @media print {
          body {
            font-size: 12px;
          }
          .container {
            max-width: 100%;
          }
          .btn-info {
            display: none; /* Hide print button in print view */
          }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
          <h2>NORTHERN LUZON MISSION</h2>
          <h3>WORKER'S PROFILE</h3>
          <p>2025</p>
            </div>
      
            <div class="section">
          <table class="details">
            <tr><td>Full Name:</td><td>${this.data.employee.employee.name}</td></tr>
            <tr><td>Date of Birth:</td><td>${this.data.employee.employee.birthdate}</td></tr>
            <tr><td>Place of Birth:</td><td>${this.data.employee.employee.birthplace}</td></tr>
            <tr><td>Residence/Address:</td><td>${this.data.employee.employee.address}</td></tr>
            <tr><td>Telephone Number:</td><td>${this.data.employee.employee.phone_number}</td></tr>
            <tr><td>Email Address:</td><td>${this.data.employee.employee.email}</td></tr>
          </table>
            </div>
      
            <div class="section" ${this.employee.employee.status !== 'Single' ? '' : 'style="display:none;"'}>
          <h3>Family Details</h3>
          <table class="details">
            <tr><td>Name of Spouse:</td><td>${this.employee.spouse.name}</td></tr>
            <tr><td>Date of Marriage:</td><td>${this.employee.spouse.marriage_date}</td></tr>
            <tr><td>Mother's Maiden Name:</td><td>${this.employee.employee.mother_maiden_name}</td></tr>
          </table>
      
          <h4>Children</h4>
          <table class="details">
            <tr><th>Name</th><th>Date of Birth</th><th>Career</th></tr>
            ${this.employee.employfamily.map((efam: { name: string; birthdate: string; career: string; }) => `
              <tr>
            <td>${efam.name}</td>
            <td>${efam.birthdate}</td>
            <td>${efam.career}</td>
              </tr>
            `).join('')}
          </table>
            </div>
      
            <div class="section">
          <h3>Education</h3>
          <table class="education">
            <tr><th>Level</th><th>Year</th><th>School</th><th>Degree</th></tr>
            ${this.employee.education.map((edu: { level: string; year: string; school: string; degree: string; }) => `
              <tr>
            <td>${edu.level}</td>
            <td>${edu.year}</td>
            <td>${edu.school}</td>
            <td>${edu.degree}</td>
              </tr>
            `).join('')}
          </table>
            </div>
      
            <div class="section">
          <h3>Employment</h3>
          <table class="employment">
            <tr><th>Position</th><th>Date</th><th>Organization/Institution</th></tr>
            ${this.employee.employment.map((emp: { position: string; date: string; organization: string; }) => `
              <tr>
            <td>${emp.position}</td>
            <td>${emp.date}</td>
            <td>${emp.organization}</td>
              </tr>
            `).join('')}
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
      }
      
}
