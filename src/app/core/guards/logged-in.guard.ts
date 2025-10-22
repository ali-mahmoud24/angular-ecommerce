import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const LoggedInGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (auth.isLoggedIn) {
    auth.redirectBasedOnRole();
    return false;
  }
  return true;
};
