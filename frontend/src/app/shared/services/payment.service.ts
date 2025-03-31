import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private router: Router) { }

  payNow(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/createOrder', data);
  }

  capturePaymentRecord(paymentData: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/recordPayment', paymentData);
  }

  cancelPayment(orderId: string): Observable<any> {
    const postData = {
      orderId: orderId
    }
    return this.http.post(environment.apiUrl + '/api/v1/cancelPayment', postData);
  }

  checkPaymentStatus(): Observable<any> {
    return this.http.get(environment.apiUrl + '/api/v1/paymentStatus');
  }
}

