import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const position = localStorage.getItem('position');
  console.log('AuthGuard Activated:', position);

  if (!position) {
    console.log('No position found, redirecting to login');
    router.navigate(['/login']);
    return of(false); // Ensure navigation cancels activation
  }

  if (position === 'hr') {
    return true; // Allow HR users
  } else {
    console.log('Non-HR user detected, redirecting to user page');
    router.navigate(['/user-page/dashboard']);
    return of(false); // Ensure navigation cancels activation
  }
};
