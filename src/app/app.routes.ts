import { CanActivateFn, Router, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';

// 🔐 Login Guard to prevent logged-in users from accessing login page
export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    console.log('User is already logged in, redirecting...');
    setTimeout(() => {
      router.navigate(['/admin-page']); // Ensures navigation happens
    }, 100);
    return false;
  }
  return true;
};


export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: 'admin-page',
     // Protects the admin page
    loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'user-page',
     // Protects the user page
    loadChildren: () => import('./Modules/user/user.module').then(m => m.UserModule),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];


