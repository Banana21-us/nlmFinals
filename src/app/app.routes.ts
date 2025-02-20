import { CanActivateFn, Router, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { RegisterComponent } from './register/register.component';

// 🔐 Login Guard to prevent logged-in users from accessing login page
export const loginGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    inject(Router).navigateByUrl('/admin-page');
    return false;
  }
  return true;
};

// 🔐 Role-based Guard
// export const authGuard: CanActivateFn = (route, state) => {
//   const role = localStorage.getItem('role'); // Assuming role is stored in localStorage
//   if (role === 'admin') {
//     return true;
//   } else if (role === 'user') {
//     inject(Router).navigateByUrl('/user-page');
//     return false;
//   }
//   inject(Router).navigateByUrl('/login');
//   return false;
// };

export const routes: Routes = [
  { path: 'register', component: RegisterComponent, },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: 'admin-page',
    loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule),

  },
  {
    path: 'user-page',
    loadChildren: () => import('./Modules/user/user.module').then(m => m.UserModule),

  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
