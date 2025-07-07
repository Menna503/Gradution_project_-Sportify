import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/products/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-payment',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.css',
})
export class ConfirmPaymentComponent {
  constructor(private router: Router, private cartService: CartService) {}

  getShippingDetailsFromLocalStorage(): {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  } | null {
    const shipping = localStorage.getItem('shippingAddress');
    return shipping ? JSON.parse(shipping) : null;
  }
  successPayment() {
    this.router.navigate(['/home']);
    // this.router.navigate(['/orders']);
  }
}
