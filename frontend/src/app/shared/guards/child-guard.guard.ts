import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const childGuardGuard: CanActivateFn = (route, state) => {
  const _authService: AuthService = inject(AuthService);
  const _router: Router = inject(Router);
  const _activeRouter: ActivatedRoute = inject(ActivatedRoute);

// _activeRouter.paramMap.subscribe((param)=>{
//   console.log(param)
//   })

 

  return !_authService.isReportGenerated()

};
