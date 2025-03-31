import { CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}
export const canDeactivateGuard: CanActivateFn = (route, state) => {
  console.log(route)
  return true;
};
