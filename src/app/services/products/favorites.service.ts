import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map ,catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favUrl = "http://127.0.0.1:8000/favorites";
  private favoriteItems: any[] = [];
  private favoriteCountSubject = new BehaviorSubject<number>(0);
  favoriteCount$ = this.favoriteCountSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadFavorites();
  }

  private getHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    const errorMessage = error.message || 'Something went wrong!';
    this.router.navigate(['/error'], {
      state: { errorMessage }
    });
    return throwError(() => new Error(errorMessage));
  }

  loadFavorites() {
    this.getfavourite().subscribe({
      next: (items) => {
        this.favoriteItems = items;
        this.favoriteCountSubject.next(items.length);
      },
      error: (err) => console.error(err)
    });
  }

  getfavourite(): Observable<any[]> {
    return this.http.get<{ status: string; results: number; data: any[] }>(this.favUrl, {
      headers: this.getHeader()
    })
    .pipe(
      map(response => response.data),
      catchError((error) => this.handleError(error))
    );
  }

  // addFavorite(productId: string): Observable<any> {
  //   return this.http.patch<any>(`${this.favUrl}/add`, { productId }, { headers: this.getHeader() })
  //     .pipe(
  //       map((res) => {
  //         this.loadFavorites();
  //         return res;
  //       }),
  //       catchError((error) => this.handleError(error))
  //     );
  // }

  // removeFavorite(productId: string): Observable<any> {
  //   return this.http.patch<any>(`${this.favUrl}/remove`, { productId }, { headers: this.getHeader() })
  //     .pipe(
  //       map((res) => {
  //         this.loadFavorites();
  //         return res;
  //       }),
  //       catchError((error) => this.handleError(error))
  //     );
  // }
  
addFavorite(productId: string): Observable<any> {
  // تحديث محلي فوري
  if (!this.favoriteItems.find(item => item.productId === productId)) {
    this.favoriteItems.push({ productId });
    this.favoriteCountSubject.next(this.favoriteItems.length);
  }

  // بعت الريكوست في الخلفية
  return this.http.patch<any>(`${this.favUrl}/add`, { productId }, { headers: this.getHeader() })
    .pipe(
      catchError((error) => this.handleError(error))
    );
}

removeFavorite(productId: string): Observable<any> {
  this.favoriteItems = this.favoriteItems.filter(item => item.productId !== productId);
  this.favoriteCountSubject.next(this.favoriteItems.length);

  return this.http.patch<any>(`${this.favUrl}/remove`, { productId }, { headers: this.getHeader() })
    .pipe(
      catchError((error) => this.handleError(error))
    );
}


}

