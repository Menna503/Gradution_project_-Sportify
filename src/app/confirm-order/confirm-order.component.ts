import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/products/cart.service';

@Component({
  selector: 'app-confirm-order',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css',
})
export class ConfirmOrderComponent implements OnInit {
  address!: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  } | null;

  showFinalConfirmation = false;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private toastr: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const storedAddress = localStorage.getItem('shippingAddress');
    if (storedAddress) {
      this.address = JSON.parse(storedAddress);
    } else {
      this.toastr.error(
        'Missing shipping details. Redirecting to checkout.',
        'Error'
      );
      this.router.navigate(['/checkout']);
    }
  }

  confirmPayment(): void {
    this.showFinalConfirmation = true;
  }

  placeOrder(): void {
    if (!this.address) {
      this.toastr.error('Shipping address missing.', 'Error');
      return;
    }

    this.paymentService
      .confirmOrder({
        paymentMethod: 'visa',
        shippingAddress: this.address,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Order placed successfully!', 'Success');
          localStorage.removeItem('totalPrice');
          localStorage.removeItem('cart');
          this.cartService.setCart([]);
          // this.router.navigate(['/orders']);
          this.router.navigate(['/confirmPayment']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(
            'Failed to confirm order. Please contact support.',
            'Error'
          );
        },
      });
  }
}
