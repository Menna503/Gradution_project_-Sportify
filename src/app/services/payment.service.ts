import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://127.0.0.1:8000/cart';

  constructor(private http: HttpClient) {}

  private getHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  checkout(paymentMethod: 'cash' | 'visa'): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/checkout`,
      { paymentMethod },
      { headers: this.getHeader() }
    );
  }

  confirmOrder(orderData: {
    paymentMethod: 'cash' | 'visa';
    shippingAddress: {
      address: string;
      city: string;
      country: string;
      postalCode: string;
      phone: string;
    };
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-order`, orderData, {
      headers: this.getHeader(),
    });
  }
  getStripeSessionStatus(sessionId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/stripe-session-status?session_id=${sessionId}`,
      {
        headers: this.getHeader(),
      }
    );
  }
}
