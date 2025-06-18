import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { I_Login, I_SignIn_Response, I_SignUp, I_SignUp_Response } from '../modal/auth.modal';
import { environment } from 'src/environments/environment';
import { STORAGE_NAME } from 'src/app/core/constants';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  email: string = 'siddheshnarayankar24@gmail.com';
  otp: any = '12345'
  isAuthenticateUser: boolean = false;

  login(loginDetails: I_Login): Observable<I_SignIn_Response> {
    return this.http.post<I_SignIn_Response>(
      environment.apiUrl + '/api/v1/loginWithOTP',
      loginDetails,
      { withCredentials: true }
    );
  }

  logout() {
    this.http.post(`${environment.apiUrl}/api/v1/logout`, {}, { withCredentials: true }).subscribe(() => {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
  

  isAuthenticated(): Observable<boolean> {
    const storedDataString = sessionStorage.getItem(STORAGE_NAME);

    if (storedDataString) {
      const { token } = JSON.parse(storedDataString);
      if (token) {
        this.isAuthenticateUser = true;
        return of(this.isAuthenticateUser)
      }
    } else {
      console.log('No data found in sessionStorage.');
    }

    return of(this.isAuthenticateUser)
  }


  onRegister(registerData: I_SignUp): Observable<I_SignUp_Response> {
    return this.http.post<I_SignUp_Response>(environment.apiUrl + '/api/v1/register', registerData)
  }

  resendOTP(emailId: string): Observable<any> {
    let request = {
      email: emailId
    }
    return this.http.post(environment.apiUrl + '/api/v1/generateOTP', request);
  }

  getuserName() {

    const storedDataString = sessionStorage.getItem(STORAGE_NAME);
    if (storedDataString) {
      let { name } = JSON.parse(storedDataString);
      const studentName = sessionStorage.getItem('STUDENT_NAME');
      if (studentName != null && studentName != 'null') {
        name = studentName;
      }
      if (name) {
        return name?.charAt(0)?.toUpperCase() + name?.slice(1);
      }
    } else {
      console.log('No data found in sessionStorage.');
    }
  }


  getuserToken() {
    const storedDataString = sessionStorage.getItem(STORAGE_NAME);
    if (storedDataString) {
      const { token } = JSON.parse(storedDataString);
      if (token) {
        return token
      }
    } else {
      console.log('No data found in sessionStorage.');
    }
  }

  getTestAnswers() {
    const storedDataString = sessionStorage.getItem(STORAGE_NAME);
    if (storedDataString) {
      const { testAnswers } = JSON.parse(storedDataString);
      if (testAnswers) {
        return testAnswers
      }
    } else {
      console.log('No data found in sessionStorage.');
    }
  }

  isReportGenerated(): boolean {
    const storedDataString = sessionStorage.getItem(STORAGE_NAME);
    let isReport: boolean = false;
    if (storedDataString) {
      const { reportGenerated } = JSON.parse(storedDataString);
      isReport = reportGenerated
    }

    return isReport
  }

  isCounsellor(): boolean {
    const storedDataString = sessionStorage.getItem(STORAGE_NAME);
    let isCounsellorLogin: string = '0';
    if (storedDataString) {
      const { isCounsellor } = JSON.parse(storedDataString);
      isCounsellorLogin = isCounsellor
    }
    return isCounsellorLogin == '1' ? true : false;
  }

}
