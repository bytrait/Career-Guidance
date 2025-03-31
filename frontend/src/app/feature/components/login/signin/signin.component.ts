import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { STORAGE_NAME } from 'src/app/core/constants';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  heading: string = 'Log in to get started.';
  isLogin_screen: boolean = true;
  isOTP_screen: boolean = false;
  loginForm: FormGroup;
  isOTPResend: boolean = false;

  constructor(private _toastr: ToastrService, private _fb: FormBuilder, private _authService: AuthService, private _router: Router) {

  }
  ngOnInit() {
    this.loginForm = this._fb.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      otp: new FormControl('', [Validators.required])
    })
  }

  isValid() {
    this.loginForm.hasValidator(Validators.required)
  }


  oResendOTP() {
    if (this.loginForm.value.email !== '') {
      this._authService.resendOTP(this.loginForm.value.email).subscribe({
        next: (result) => {
          if (result.success) {
            this._toastr.warning(`Please check your email for the OTP sent to your email ${this.loginForm.value.email} address`);
            this._toastr.success(result.message);
            this.isOTPResend = true;
          } else {
            this._toastr.error(result.message);
          }
        },
        error: (e) => {
          this._toastr.error(e?.message);
        }
      })

    } else {
      this._toastr.error('Enter Valid Email ID');
    }
  }

  onLogin() {
    let loginDetails = {
      ...this.loginForm.value
    }

    this._authService.login(loginDetails).subscribe({
      next: (result) => {
        if (result.success) {
          this._router.navigate(['/dashboard']);

          this._toastr.success(result.message);
          let userSessionData = {
            ...result.user,
            reportGenerated: result.reportGenerated,
            testAnswers: result.testAnswers,
          }
          sessionStorage.setItem(STORAGE_NAME, JSON.stringify(userSessionData));
        } else {
          this._toastr.error(result.message);
        }
      },
      error: (e: any) => {
        this._toastr.error(e.name + ':' + ' ' + e.message + ' ' + 'Check if the email entered is correct or click on Resend');
      }
    })
  }
}
