import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ConfirmOrderGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const address = localStorage.getItem('shippingAddress');
    const totalPrice = localStorage.getItem('totalPrice');
    if (address && totalPrice) {
      return true;
    }
    this.router.navigate(['/checkout']);
    return false;
  }
}
