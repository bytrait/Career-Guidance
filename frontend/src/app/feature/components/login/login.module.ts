import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OtpComponent } from './otp/otp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CounsellorSignupComponent } from './counsellor-signup/counsellor-signup.component';
@NgModule({
  declarations: [
    LoginComponent,
    SigninComponent,
    SignupComponent,
    OtpComponent,
    CounsellorSignupComponent
  ],
  exports:[
    SigninComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
