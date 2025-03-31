import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PaymentService } from 'src/app/shared/services/payment.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

  constructor(private router: Router, private activeRouter: ActivatedRoute, private _authService: AuthService, private _paymentService: PaymentService, private _toastr: ToastrService) {

  }
  userName: string = ''
  showWelcome: boolean = false;
  showEmailMessage: boolean = false;

  ngOnInit() {
    this.userName = this._authService.getuserName();
    this.activeRouter.params.subscribe((item) => {

    })
    // check payment is done 
    // if yes then navigate to personality test
    // else show payment page
    this._paymentService.checkPaymentStatus().subscribe({
      next: (result) => {
        if (result.paymentStatus !== 'Done') {
          this.router.navigate(['dashboard/payment'])
        }
        else {
          const showEmail = sessionStorage.getItem('SHOW_EMAIL_MESSAGE');
          if (showEmail === 'true') {
            this.showEmailMessage = true;
            this.showWelcome = false;
          } else {
            this.showWelcome = true;
            this.showEmailMessage = false;
          }
        }
      },
      error: (e) => {
        this._toastr.error(e?.message);
      }
    })
  }

  showWelcomeSection() {
    this.showWelcome = true;
    this.showEmailMessage = false;
    sessionStorage.removeItem('SHOW_EMAIL_MESSAGE');
  }

  onStartTest() {
    // check payment is done 
    // if yes then navigate to personality test
    // else show payment page
    this._paymentService.checkPaymentStatus().subscribe({
      next: (result) => {
        if (result.paymentStatus === 'Done') {
          this.router.navigate(['dashboard/personality-welcome'])
        }
        else {
          this.router.navigate(['dashboard/payment'])
        }
      },
      error: (e) => {
        this._toastr.error(e?.message);
      }
    })

  }
}
