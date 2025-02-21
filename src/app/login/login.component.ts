import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { ApiService } from '../api.service';
import { RegisterComponent } from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private conn: ApiService, private router: Router) {}
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
  
          console.log('Token stored:', result.token);
  
          setTimeout(() => {
            // **Re-fetch position to ensure accuracy**
            const position = localStorage.getItem('position');
            console.log('Updated position:', position);
  
            if (position === 'hr') {
              this.router.navigateByUrl('/admin-page');
            } else {
              this.router.navigateByUrl('/user-page');
            }
          }, 300); // Slightly longer delay ensures updates before navigation
        }
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }
  
  
  
  
  


  openDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '95vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: 'auto',
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Only call getdata() if the dialog closed after successful submission
        // this.getdata();
      }
    });
  }
  
}
