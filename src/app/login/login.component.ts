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

  login() {
    this.conn.login(this.loginForm.value).subscribe(
      (result: any) => {
        if (result.token != null) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', result.id);

          const user = result.admin;
          localStorage.setItem('users', JSON.stringify(user));
          
          console.log('Token stored:', result.token);
          this.navigateToMainPage();
        }
        // console.log(result);
      }
    );
}


  navigateToMainPage() {
    this.router.navigate(['main-page/Dashboard']);
    // window.location.reload()
    }
}
