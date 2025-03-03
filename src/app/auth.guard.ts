import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if we are in the browser before using localStorage
  if (!isPlatformBrowser(platformId)) {
    console.warn('AuthGuard: Running on server, skipping localStorage access');
    return of(false);
  }

  const position = localStorage.getItem('position');
  console.log('AuthGuard Activated:', position, typeof position);

  if (!position || position === 'null' || position === 'undefined') {
    console.log('No valid position found, redirecting to login');
    router.navigate(['/login']);
    return of(false);
  }
  // Check if the user is trying to access the admin page
  if (route.routeConfig?.path?.startsWith('admin-page')) {
    if (position === 'hr') {
      return true;
    } else {
      console.log('Non-HR user trying to access admin page, redirecting to user page');
      router.navigate(['/user-page/dashboard']);
      return of(false);
    }
  }

  // Check if the user is trying to access the user page
  if (route.routeConfig?.path?.startsWith('user-page')) {
    if (position !== 'hr') {
      return true;
    } else {
      console.log('HR user trying to access user page, redirecting to admin page');
      router.navigate(['/admin-page/dashboard']);
      return of(false);
    }
  }

  // Default fallback
  router.navigate(['/login']);
  return of(false);
};
