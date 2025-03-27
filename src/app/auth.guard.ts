import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    console.warn('AuthGuard: Running on server, skipping localStorage access');
    return of(false);
  }

  const position = localStorage.getItem('position');
  const department = localStorage.getItem('department');
  console.log('AuthGuard Activated:', position, typeof position);

  if (!position || position === 'null' || position === 'undefined') {
    console.log('No valid position found, redirecting to login');
    setTimeout(() => router.navigate(['/login']), 0);
    return of(false);
  }

  const positionsArray = position.split(',').map(p => p.trim());
  console.log('Positions Array:', positionsArray);

  // Check if the user has a defined position for specific pages
  if (route.routeConfig?.path?.startsWith('admin-page')) {
    if (positionsArray.includes('Human Resource') || positionsArray.includes('Executive Secretary')) {   
      return of(true);
    }
  }

  if (route.routeConfig?.path?.startsWith('accounting-page')) {
    if (positionsArray.includes('Chief Accountant') || positionsArray.includes('Disbursing Accountant')) {
      return of(true);
    }
  }

  if (route.routeConfig?.path?.startsWith('archives-page')) {
    if (positionsArray.includes('Executive Secretary') || department === 'Secretariat') {
      return of(true);
    }
  }

  if (route.routeConfig?.path?.startsWith('president-page')) {
    if (positionsArray.includes('President')) {
      return of(true);
    }
  }

  if (route.routeConfig?.path?.startsWith('departmenthead-page')) {
    if (
      positionsArray.includes('Treasurer') ||
      ['Communication Ministry', 'Spirit of Prophecy', 'Education', 'Ministerial', 'Stewardship Ministry', 'Youth Ministries', 'Women Ministry', 'Sabbath School Personal Ministries'].some(pos => positionsArray.includes(pos))
    ) {
      return of(true);
    }
  }

  // Allow direct access to user-page if it starts with "/user-page"
  if (state.url.startsWith('/user-page')) {
    console.log('Access granted to user-page/dashboard');
    return of(true);
  }

  // If no matching position is found, redirect to user-page/dashboard **after returning false**
  console.log('No matching position found, redirecting to /user-page/dashboard');
  setTimeout(() => router.navigate(['/user-page/dashboard']), 0);
  return of(false);
};

