import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/authservice/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/cart';

  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private cartChangedSource = new BehaviorSubject<void>(undefined);
  cartChanged$ = this.cartChangedSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeCart();
  }

  initializeCart(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.getCartProducts().subscribe({
        next: () => {},
        error: () => this.loadCartFromStorage(),
      });
    } else {
      this.loadCartFromStorage();
    }
  }

  refreshCartCount(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('UserId');

    if (token && userId) {
      this.http
        .get<any>(`http://127.0.0.1:8000/users/${userId}`, this.getHeaders())
        .subscribe({
          next: (res: any) => {
            const cart = res?.data?.user?.cart || [];
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartState(cart);
            this.notifyCartChanged();
            console.log('Fetched cart from user:', cart);
          },
          error: (err) => {
            console.error('Failed to fetch user cart:', err);
            this.clearCart();
          },
        });
    } else {
      this.clearCart();
    }
  }

  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];
    this.cartItems.next(cart);
    this.cartCount.next(cart.length);
  }

  private updateCartState(updatedCart: any[]): void {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.cartItems.next(updatedCart);
    this.cartCount.next(updatedCart.length);
  }

  private notifyCartChanged(): void {
    this.cartChangedSource.next();
  }

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

  setCart(cart: any[]): void {
    this.updateCartState(cart);
  }

  addToCart(
    productId: string,
    quantity: number,
    size: string
  ): Observable<any> {
    const body = { products: [{ productId, quantity, size }] };
    return this.http.post(`${this.apiUrl}`, body, this.getHeaders()).pipe(
      tap((res: any) => {
        if (res?.data?.cart) {
          this.updateCartState(res.data.cart);
          this.notifyCartChanged();
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
    const body = { updates: [{ productId, quantity, currentSize }] };
    return this.http.patch(`${this.apiUrl}`, body, this.getHeaders()).pipe(
      tap((res: any) => {
        if (res?.data?.cart) {
          this.updateCartState(res.data.cart);
          this.notifyCartChanged();
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  updateSize(
    productId: string,
    currentSize: string,
    newSize: string
  ): Observable<any> {
    const body = { updates: [{ productId, currentSize, newSize }] };
    return this.http.patch(`${this.apiUrl}`, body, this.getHeaders()).pipe(
      tap((res: any) => {
        if (res?.data?.cart) {
          this.updateCartState(res.data.cart);
          this.notifyCartChanged();
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  removeFromCart(productId: string, size: string): Observable<any> {
    const body = { productId, size };
    return this.http
      .request('DELETE', this.apiUrl, {
        headers: this.getHeaders().headers,
        body,
      })
      .pipe(
        tap((res: any) => {
          if (res?.data?.cart) {
            this.updateCartState(res.data.cart);
            this.notifyCartChanged();

            // 🟢 Remove from out-of-stock local list
            const stored = localStorage.getItem('userOutOfStockItems');
            if (stored) {
              const outOfStockItems = JSON.parse(stored);
              const updatedList = outOfStockItems.filter(
                (id: string) => id !== productId
              );
              localStorage.setItem(
                'userOutOfStockItems',
                JSON.stringify(updatedList)
              );
            }
          }
        }),
        catchError((error) => this.handleError(error))
      );
  }

  getCartProducts(): Observable<any[]> {
    const userId = localStorage.getItem('UserId');
    if (!userId) {
      this.loadCartFromStorage();
      return of([]);
    }

    return this.http
      .get<any>(`http://127.0.0.1:8000/users/${userId}`, this.getHeaders())
      .pipe(
        tap((res: any) => {
          if (res?.data?.cart) {
            this.updateCartState(res.data.cart);
            this.notifyCartChanged();
          }
        }),
        catchError((error) => this.handleError(error))
      );
  }

  updateCart(updates: any[]): Observable<any> {
    const body = { updates };
    return this.http.patch(`${this.apiUrl}`, body, this.getHeaders()).pipe(
      tap((res: any) => {
        if (res?.data?.cart) {
          this.updateCartState(res.data.cart);
          this.notifyCartChanged();
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.cartItems.next([]);
    this.cartCount.next(0);
    this.notifyCartChanged();
  }

  checkout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/checkout`, {}, this.getHeaders())
      .pipe(catchError((error) => this.handleError(error)));
  }
}

// import {
//   HttpClient,
//   HttpHeaders,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { AuthService } from '../auth/authservice/auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private apiUrl = 'http://127.0.0.1:8000/cart';

//   private cartItems = new BehaviorSubject<any[]>([]);
//   cartItems$ = this.cartItems.asObservable();

//   private cartCount = new BehaviorSubject<number>(0);
//   cartCount$ = this.cartCount.asObservable();

//   constructor(
//     private http: HttpClient,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.loadCartFromStorage();
//   }

//   private loadCartFromStorage(): void {
//     const storedCart = localStorage.getItem('cart');
//     if (storedCart) {
//       const cart = JSON.parse(storedCart);
//       this.cartItems.next(cart);
//       this.cartCount.next(cart.length);
//     }
//   }

//   private getHeaders() {
//     const token = localStorage.getItem('token');
//     return {
//       headers: new HttpHeaders({
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       }),
//     };
//   }

//   private handleError(error: HttpErrorResponse) {
//     console.error('Error occurred:', error);
//     const errorMessage = error.message || 'Something went wrong!';
//     this.router.navigate(['/error'], {
//       state: { errorMessage },
//     });
//     return throwError(() => new Error(errorMessage));
//   }

//   private updateCartState(updatedCart: any[]): void {
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     this.cartItems.next(updatedCart);
//     this.cartCount.next(updatedCart.length);
//   }

//   setCart(cart: any[]): void {
//     this.updateCartState(cart);
//   }

//   addToCart(
//     productId: string,
//     quantity: number,
//     size: string
//   ): Observable<any> {
//     const body = { products: [{ productId, quantity, size }] };
//     return this.http.post(`${this.apiUrl}`, body, this.getHeaders()).pipe(
//       tap((res: any) => {
//         if (res?.data?.cart) {
//           this.updateCartState(res.data.cart);
//         }
//       }),
//       catchError((error) => this.handleError(error))
//     );
//   }

//   updateQuantity(
//     productId: string,
//     quantity: number,
//     currentSize: string
//   ): Observable<any> {
//     const body = { updates: [{ productId, quantity, currentSize }] };
//     return this.http.patch(`${this.apiUrl}`, body, this.getHeaders()).pipe(
//       tap((res: any) => {
//         if (res?.data?.cart) {
//           this.updateCartState(res.data.cart);
//         }
//       }),
//       catchError((error) => this.handleError(error))
//     );
//   }

//   updateSize(
//     productId: string,
//     currentSize: string,
//     newSize: string
//   ): Observable<any> {
//     const body = { updates: [{ productId, currentSize, newSize }] };
//     return this.http.patch(`${this.apiUrl}`, body, this.getHeaders()).pipe(
//       tap((res: any) => {
//         if (res?.data?.cart) {
//           this.updateCartState(res.data.cart);
//         }
//       }),
//       catchError((error) => this.handleError(error))
//     );
//   }

//   // removeFromCart(productId: string, size: string): Observable<any> {
//   //   const body = { productId, size };
//   //   return this.http
//   //     .request('DELETE', this.apiUrl, {
//   //       headers: this.getHeaders().headers,
//   //       body,
//   //     })
//   //     .pipe(
//   //       tap((res: any) => {
//   //         if (res?.data?.cart) {
//   //           this.updateCartState(res.data.cart);
//   //         }
//   //       }),
//   //       catchError((error) => this.handleError(error))
//   //     );
//   // }

//   removeFromCart(productId: string, size: string): Observable<any> {
//   const body = { productId, size };
//   return this.http
//     .request('DELETE', this.apiUrl, {
//       headers: this.getHeaders().headers,
//       body,
//     })
//     .pipe(
//       tap((res: any) => {
//         if (res?.data?.cart) {
//           this.updateCartState(res.data.cart);

//           // 🟢 حذف المنتج من قائمة out-of-stock الخاصة بالمستخدم
//           const stored = localStorage.getItem('userOutOfStockItems');
//           if (stored) {
//             const outOfStockItems = JSON.parse(stored);
//             const updatedList = outOfStockItems.filter((id: string) => id !== productId);
//             localStorage.setItem('userOutOfStockItems', JSON.stringify(updatedList));
//           }
//         }
//       }),
//       catchError((error) => this.handleError(error))
//     );
// }

//   getCartProducts(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl, this.getHeaders()).pipe(
//       tap((res: any) => {
//         if (res?.data) {
//           this.updateCartState(res.data);
//         }
//       }),
//       catchError((error) => this.handleError(error))
//     );
//   }

//   updateCart(updates: any[]): Observable<any> {
//     const body = { updates };
//     return this.http.patch(`${this.apiUrl}`, body, this.getHeaders()).pipe(
//       tap((res: any) => {
//         if (res?.data?.cart) {
//           this.updateCartState(res.data.cart);
//         }
//       }),
//       catchError((error) => this.handleError(error))
//     );
//   }

//   clearCart(): void {
//     localStorage.removeItem('cart');
//     this.cartItems.next([]);
//     this.cartCount.next(0);
//   }

//   checkout(): Observable<any> {
//     return this.http
//       .post(`${this.apiUrl}/checkout`, {}, this.getHeaders())
//       .pipe(catchError((error) => this.handleError(error)));
//   }
// }
