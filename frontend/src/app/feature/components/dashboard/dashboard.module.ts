import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { CareerInterestWelcomeComponent } from './career-interest-welcome/career-interest-welcome.component';
import { CongratulationComponent } from './congratulation/congratulation.component';
import { PersonalityTestWelcomeComponent } from './personality-test-welcome/personality-test-welcome.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';


@NgModule({
  declarations: [
    DashboardComponent,
    WelcomeComponent,
    CareerInterestWelcomeComponent,
    CongratulationComponent,
    PersonalityTestWelcomeComponent,
    AboutUsComponent,
    ContactUsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
