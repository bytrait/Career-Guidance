import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { STORAGE_NAME } from 'src/app/core/constants';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
 
@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService, private router: Router) { }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      //navigate /delete cookies or whatever
      this.router.navigateByUrl(`/login`);
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return throwError(() => new Error(err.error.message)); // or EMPTY may be appropriate here
    }
    return throwError(() => new Error(err.error.message));
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this._authService.getuserToken();


    if (token) {
      const modifiedReq = request.clone({
        setHeaders: {
          Authorization: `${token}`,
        },
      });
      return next.handle(modifiedReq);
    }

    return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
  }
}
