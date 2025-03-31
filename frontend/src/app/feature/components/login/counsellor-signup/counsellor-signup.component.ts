
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-counsellor-signup',
  templateUrl: './counsellor-signup.component.html',
  styleUrls: ['./counsellor-signup.component.scss']
})
export class CounsellorSignupComponent {
  phoneNumber = "^(\+\d{1,3}[- ]?)?\d{10}$";
  signupForm: FormGroup;
  isSignInError: boolean = false;
  constructor(private _toastr: ToastrService, private _fb: FormBuilder, private _authService: AuthService, private _router: Router) {

  }

  ngOnInit() {
    this._toastr.clear();
    this.signupForm = this._fb.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      name: new FormControl("", [Validators.required]),
      registrationToken: new FormControl("", [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      isCounsellor: new FormControl("1", [Validators.required]),
    })
  }
  signup() {
    this._authService.onRegister(this.signupForm.value).subscribe({
      next: (result) => {
        if (result.success) {
          this._toastr.success(result.message);
          setTimeout(() => {
            this._router.navigate(['login'])
          }, 100);
        } else {
          this.getError(result.message)
        }
      },
      error: (error) => {
        this.getError(error.message)
      }
    }
    )

  }

  getError(errorMsg: string) {
    this.signupForm.setErrors({ 'invalid': true });
    this.signupForm.disabled
    this._toastr.error(errorMsg, '', {
      closeButton: true,
      disableTimeOut: true,
      tapToDismiss: false
    })
      .onHidden
      .subscribe(() => {
        this.signupForm.setErrors({ 'invalid': null })
        this.signupForm.updateValueAndValidity()
      }
      );
  }

  login() {
    this._toastr.clear();
    this._router.navigate(['/login'])
  }

  ngOnDestory() {
    this._toastr.clear();
  }
}




