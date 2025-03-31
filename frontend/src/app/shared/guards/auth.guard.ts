import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const _authService: AuthService = inject(AuthService);
  const _router: Router = inject(Router);

  return _authService.isAuthenticated().pipe(
    map((status) => {
      if (status) {
        return status
      }
      return false
    })
  )

};
