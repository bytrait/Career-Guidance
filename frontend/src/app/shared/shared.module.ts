import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HeroSectionComponent } from './component/hero-section/hero-section.component';
import { CareerTestService } from './services/career-test.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { provideToastr } from 'ngx-toastr';
import { BsDropdownConfig, BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthService } from './services/auth.service';
import { RouterModule } from '@angular/router';
import { PersonalityTestService } from './services/personality-test.service';
import { WorkStreamService } from './services/work-stream.service';
import { ModalSuccessComponent } from './component/modal-success/modal-success.component';
import { PaymentComponent } from './component/payment/payment/payment.component';
import { PaymentService } from './services/payment.service';
import { CourseService } from './services/course.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
 

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HeroSectionComponent,
    HeaderComponent,
    ModalSuccessComponent,
    PaymentComponent,
    ConfirmationDialogComponent
  ],
  exports: [HeaderComponent, FooterComponent, HeroSectionComponent, ToastrModule, RouterModule, BsDropdownModule, PaymentComponent],
  providers: [
    CareerTestService,
    AuthService,
    ToastrService,
    WorkStreamService,
    PersonalityTestService,
    PaymentService,
    CourseService,
    { provide: BsDropdownDirective, useValue: { autoClose: true } }
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    RouterModule,
    MatDialogModule,
    BsDropdownModule.forRoot()
  ],
 
})
export class SharedModule { }
