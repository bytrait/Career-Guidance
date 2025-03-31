import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/shared/services/auth.service';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  phoneNumber = "^(\+\d{1,3}[- ]?)?\d{10}$";
  signupForm: FormGroup;
  isSignInError: boolean = false;
  courses: string[] = [];
  constructor(private _toastr: ToastrService, private _fb: FormBuilder, private _authService: AuthService, private _courseService: CourseService, private _router: Router,  private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this._toastr.clear();
    this.courses = [];
    this.signupForm = this._fb.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      name: new FormControl("", [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      registrationToken: new FormControl('', [Validators.required]),
      branch: new FormControl('', [Validators.required]),
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

  fetchCourses() {
    this._courseService.getCourses(this.signupForm.value['registrationToken']).subscribe({
      next: (result) => {
        if (result.success) {
          this.courses = result.courses;
          this.cd.detectChanges(); 
        } else {
          this.getError(result.message)
          this.cd.detectChanges(); 
        }
      },
      error: (error) => {
        this.getError(error.message)
        this.cd.detectChanges(); 
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



