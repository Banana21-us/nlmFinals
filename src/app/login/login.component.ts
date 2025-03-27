import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { ApiService } from '../api.service';
import { RegisterComponent } from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    ToastModule
  ],
  styles: [`
    :host ::ng-deep .p-toast {
      width: 335px; /* Adjust width as needed */
      font-size: 0.8rem; /* Adjust font size as needed */
      left: 50%;
      transform: translateX(-50%);
    }

    :host ::ng-deep .p-toast-message-content {
      padding: 0.75rem; /* Adjust padding as needed */
    }

    :host ::ng-deep .p-toast-summary {
      font-weight: bold;
    }
  `],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  constructor(private conn: ApiService, private router: Router,private messageService: MessageService) {}
  readonly dialog = inject(MatDialog);
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  

  login() {
    this.conn.login(this.loginForm.value).subscribe(
      (result: any) => {
        console.log('Login response:', result);
        if (result.reg_approval === null) {
          console.warn('Registration not approved. Unable to login.');
          alert('Your registration is pending approval. Please wait for confirmation.');
          return; // Stop further execution
        }
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', result.id);
          localStorage.setItem('users', JSON.stringify(result.admin));
          localStorage.setItem('position', result.position);
          localStorage.setItem('department', result.department);

          console.log('Token stored:', result.token);

          localStorage.setItem('admin_pic', result.admin.img);
          console.log('Admin picture stored:', result.admin.img);

          const user = result.admin;
          if (user && user.img) {
            if (!user.img.startsWith('http://localhost:8000')) {
              user.img = `http://localhost:8000/assets/userPic/${user.img}`;
            }
          }
          this.conn.updateUserPic(user.img);
          console.log('Admin picture updated:', user.img);
          setTimeout(() => {
            const position = localStorage.getItem('position');
            const usersData = localStorage.getItem('users'); // Get users JSON string
          
            let department = null;
            if (usersData) {
              try {
                const users = JSON.parse(usersData); // Parse JSON string
                department = users.department; // Get department
              } catch (error) {
                console.error('Error parsing users data:', error);
              }
            }
          
            if (position) {
              const positionsArray = position.split(',').map(p => p.trim()); // Split and trim spaces
              console.log('Updated positions:', positionsArray);
              console.log('User department:', department);

              // archives and records and admin
              if (department === 'Secretariat' && positionsArray.includes('Executive Secretary')) {
                this.router.navigate(['/archives-page/dashboard']);
              } 

              else if (department === 'Administrators' && positionsArray.includes('Executive Secretary')) {
                this.router.navigate(['/admin-page/dashboard']);
              } 

              // accounting 
              else if (
                department === 'Accounting Personnel' && 
                (positionsArray.includes('Chief Accountant') || positionsArray.includes('Disbursing Accountant'))
              ) { 
                this.router.navigate(['/accounting-page/dashboard']);
              }
              else if (
                department === 'Administrators' && 
                (positionsArray.includes('Treasurer'))
              ) { 
                this.router.navigate(['/departmenthead-page/dashboard']);
              }

              // directors
              else if (
                department === 'Directors' && 
                  ['Communication Ministry', 'Spirit of Prophecy', 'Education', 'Ministerial','Stewardship Ministry','Youth Ministries','Women Ministry','Sabbath School Personal Ministries'].some(pos => positionsArray.includes(pos))
              ) {
                  this.router.navigate(['/departmenthead-page/dashboard']);
              }
              // president 
              else if (
                department === 'Administrators' && 
                (positionsArray.includes('President'))
              ) { 
                this.router.navigate(['/president-page/dashboard']);
              }
                else {
                this.router.navigate(['/user-page/dashboard']);
              }
            } else {
              console.error('No position found in localStorage');
              this.router.navigate(['/user-page/dashboard']); // Default route
            }
          }, 300); 
        }

        
      },
      (error) => {
        console.error('Login failed', error);
        this.messageService.add({ 
          severity: 'warn', 
          summary: 'Invalid', 
          detail: 'Invalid Credentials',
          life: 3000
      });
      }
    );
  }
  

  openDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '95vw',
      height: '87vh',
      maxWidth: '95vw',
      maxHeight: '87vh',
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Pending', 
          detail: 'Please wait for your account approval.',
          life: 3000
      });
      }
    });
  }
  
}
