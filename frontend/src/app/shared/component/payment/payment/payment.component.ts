import { Component, OnInit } from '@angular/core';
import { WindowRefService } from 'src/app/shared/services/window-ref.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { STORAGE_NAME } from 'src/app/core/constants';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [WindowRefService]
})
export class PaymentComponent implements OnInit {
  constructor(private http: HttpClient, private winRef: WindowRefService, private _paymentService: PaymentService, private _toastr: ToastrService, private router: Router) {
  }

  ngOnInit(): void {

  }

  createRazorpayOrder() {
    const amount: number = 299;
    const storedDataString = sessionStorage.getItem(STORAGE_NAME);
    let username: string = '';
    if (storedDataString) {
      const userData = JSON.parse(storedDataString);
      username = userData.username;
    }
    const data = {
      amount: amount,
      username: username
    }
    this._paymentService.payNow(data).subscribe({
      next: (result) => {
        //console.log(result);
        const orderData: any = {
          amount: result.data.amount,
          orderId: result.data.orderId,
          currancy: result.data.currency,
          username: username
        }
        this.payWithRazor(orderData);
        if (result.success) {
          this._toastr.success(result.message);
        } else {
          this._toastr.error(result.message);
        }
      },
      error: (e) => {
        this._toastr.error(e?.message);
      }
    })
  }

  payWithRazor(orderData: any) {
    const options: any = {
      key: 'rzp_live_nCRvnzUP5aoZqm',
      //key: 'rzp_test_PGCPBMuqK07B1C',
      amount: orderData.amount,
      currancy: orderData.currancy,
      description: 'Order for user: ' + orderData.username,
      order_id: orderData.orderId,
      modal: {
        escape: false, //Prevent closing of the form when esc key is pressed.
      },
      notes: {

      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = (response: any, error: any) => {
      options.response = response;
      //console.log("response>>>>>>>> " + response);
      response.username = orderData.username;
      //console.log("options>>>>>>>> " + options);
      // call backend api to verify payment signature and capture transation
      this._paymentService.capturePaymentRecord(response).subscribe({
        next: (result) => {
          if (result.success) {
            // update user token
            const storedDataString = sessionStorage.getItem(STORAGE_NAME);
            let userData;
            if (storedDataString) {
              userData = JSON.parse(storedDataString);
              userData.token = result.token;
            }
            sessionStorage.setItem(STORAGE_NAME, JSON.stringify(userData));

            // after successul payment navigate to welcome screen
            //this.router.navigate(['dashboard/personality-welcome']);
            sessionStorage.setItem('SHOW_EMAIL_MESSAGE', 'true');
            this.router.navigate(['dashboard/welcome']);
          } else {
            this._toastr.error('Error in processing your payment');
          }
        },
        error: (e) => {
          this._toastr.error(e?.message);
        }
      })
    };
    options.modal.ondismiss = () => {
      //console.log("Transaction Cancelled");
      // cancel this payment
      const orderId = orderData.orderId;
      this._paymentService.cancelPayment(orderId).subscribe({
        next: (result) => {
          this._toastr.info("Transaction Cancelled");
        },
        error: (e) => {
          this._toastr.error(e?.message);
        }
      })
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
}
