import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map ,catchError } from 'rxjs/operators';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favUrl="http://127.0.0.1:8000/favorites"
  constructor(private http:HttpClient ,
      private router: Router ) { }

  private getHeader():HttpHeaders{
    const token =localStorage.getItem('token')
    console.log(token);
    return new HttpHeaders({
      'Authorization':`Bearer ${token}`,
      'content-type':'application/json'
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
  
  
  getfavourite(): Observable<any[]> {
    return this.http.get<{ status: string; results: number; data: any[] }>(this.favUrl, { headers: this.getHeader() })
      .pipe(
        map(response => response.data) ,
        catchError((error) => this.handleError(error))
      );
  }
  

  addFavorite(productId: string): Observable<any> {
    return this.http.patch<any>(`${this.favUrl}/add`, { productId }, { headers: this.getHeader() }).pipe(
          catchError((error) => this.handleError(error)) 
        );
  }

  removeFavorite(productId: string): Observable<any> {
    return this.http.patch<any>(`${this.favUrl}/remove`, { productId }, { headers: this.getHeader() }).pipe(
      catchError((error) => this.handleError(error)) 
    );
  }
 
}