import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const userRole = authService.getUserRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    if (userRole === 'CUSTOMER') {
      router.navigate(['/home']);
    } else if (userRole === 'EMPLOYEE') {
      router.navigate(['/dashboard']);
    } else {
      router.navigate(['/login']);
    }

    return false;
  };
};
