import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { CounsellorSignupComponent } from './counsellor-signup/counsellor-signup.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent,
    children: [
      { path: 'login', component: SigninComponent },
    ]
  },
  { path: 'signup', component: SignupComponent },
  { path: 'signup-counsellor', component: CounsellorSignupComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
