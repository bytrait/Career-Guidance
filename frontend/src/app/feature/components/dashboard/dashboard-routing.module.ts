import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { CareerTestModule } from '../career-test/career-test.module';
import { CareerInterestWelcomeComponent } from './career-interest-welcome/career-interest-welcome.component';
import { CongratulationComponent } from './congratulation/congratulation.component';
import { ReportsModule } from '../reports/reports.module';
import { PersonalityTestWelcomeComponent } from './personality-test-welcome/personality-test-welcome.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { childGuardGuard } from 'src/app/shared/guards/child-guard.guard';
import { StudentsReportComponent } from '../students-report/students-report.component';
import { PaymentComponent } from 'src/app/shared/component/payment/payment/payment.component';
import { CareerPreferenceComponent } from '../career-preference/career-preference.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent, canActivate: [childGuardGuard] },
      { path: 'personality-welcome', component: PersonalityTestWelcomeComponent, canActivate: [childGuardGuard] },
      { path: 'careertest-welcome', component: CareerInterestWelcomeComponent, canActivate: [childGuardGuard] },
      { path: 'aboutUs', component: AboutUsComponent },
      { path: 'contactUs', component: ContactUsComponent },
      { path: 'congrats', component: CongratulationComponent, canActivate: [childGuardGuard] },
      { path: 'career', loadChildren: () => CareerTestModule, canActivate: [childGuardGuard] },
      { path: 'reports', loadChildren: () => ReportsModule },
      { path: 'student-reports', component: StudentsReportComponent  },
      { path: 'career-preference', component: CareerPreferenceComponent  },
      { path: 'payment', component: PaymentComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
