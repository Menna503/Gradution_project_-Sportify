import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth/authservice/auth.service';
import { Router } from '@angular/router';
import { CartUpdate } from '../../components/cart/cart.component';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/cart';
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    const errorMessage = error.message || 'Something went wrong!';
    this.router.navigate(['/error'], {
      state: { errorMessage },
    });

    return throwError(() => new Error(errorMessage));
  }

  addToCart(
    productId: string,
    quantity: number,
    size: string
  ): Observable<any> {
    const body = { products: [{ productId, quantity, size }] };
    return this.http.post(`${this.apiUrl}`, body, this.getHeaders()).pipe(
      tap((response: any) => {
        if (response && response.data && response.data.cart) {
          const updatedCart = response.data.cart;
          localStorage.setItem('cart', JSON.stringify(response.data.cart));
          this.cartItems.next(response.data.cart);
          this.cartCount.next(updatedCart.length);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  updateQuantity(
    productId: string,
    quantity: number,
    currentSize: string
  ): Observable<any> {
    const body = {
      updates: [
        {
          productId,
          quantity,
          currentSize,
        },
      ],
    };

    return this.http.patch(`${this.apiUrl}`, body, this.getHeaders());
  }

  getCartProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, this.getHeaders()).pipe(
      tap((response: any) => {
        if (response && response.data) {
          this.cartItems.next(response.data);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  removeFromCart(productId: string, size: string): Observable<any> {
    const url = `${this.apiUrl}`;
    const body = { productId, size };
    console.log(body);
    return this.http
      .request('DELETE', url, {
        headers: this.getHeaders().headers,
        body,
      })
      .pipe(
        tap((response: any) => {
          if (response && response.data && response.data.cart) {
            const updatedCart = response.data.cart;
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            this.cartItems.next(updatedCart);
            this.cartCount.next(updatedCart.length);
          }
        })
      );
  }
  updateSize(
    productId: string,
    currentSize: string,
    newSize: string
  ): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const body = {
      updates: [
        {
          productId,
          currentSize,
          newSize,
        },
      ],
    };

    return this.http.patch(`${this.apiUrl}`, body, { headers }).pipe(
      tap((response: any) => {
        if (response?.data?.cart) {
          const updatedCart = response.data.cart;
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          this.cartItems.next(updatedCart);
          this.cartCount.next(updatedCart.length);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  clearCart() {
    localStorage.removeItem('cart');
    this.cartCount.next(0);
  }
  Checkout() {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/checkout`, {}, { headers });
  }

  updateCart(updates: CartUpdate[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const body = { updates };

    return this.http.patch(`${this.apiUrl}`, body, { headers }).pipe(
      tap((response: any) => {
        if (response?.data?.cart) {
          const updatedCart = response.data.cart;
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          this.cartItems.next(updatedCart);
          this.cartCount.next(updatedCart.length);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }
}
