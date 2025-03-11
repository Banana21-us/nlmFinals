import { CanActivateFn, Router, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
// 🔐 Login Guard to prevent logged-in users from accessing login page

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      console.log('User is already logged in, redirecting...');
      setTimeout(() => {
        router.navigate(['/admin-page']);
      }, 100);
      return false;
    }
  }

  return true;
};


export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: 'admin-page',
    // canActivate: [authGuard], // Protect admin routes
    loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'user-page',
    // canActivate: [authGuard], // Protect user routes
    loadChildren: () => import('./Modules/user/user.module').then(m => m.UserModule),
  },
  {
    path: 'accounting-page',
    // canActivate: [authGuard], // Protect user routes
    loadChildren: () => import('./Modules/accounting/accounting.module').then(m => m.AccountingModule),
  },
  {
    path: 'archives-page',
    // canActivate: [authGuard], // Protect user routes
    loadChildren: () => import('./Modules/archives/archives.module').then(m => m.ArchivesModule),
  },

  
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];