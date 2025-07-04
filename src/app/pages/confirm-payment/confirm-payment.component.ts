import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';
import { CartService } from '../../services/products/cart.service';

@Component({
  selector: 'app-confirm-payment',
  imports: [HeaderComponent,FooterComponent,RouterModule],
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.css'
})
export class ConfirmPaymentComponent {
  constructor(private router: Router,  private cartService: CartService) {}

  address = localStorage.getItem('address');

  successPayment() {
    this.cartService.Checkout().subscribe({
      next: () => {
        console.log("Cart removed successfully");
        this.cartService.clearCart();
        this.router.navigate(['/home']);},
      error: (err) => {
        console.error("Error during checkout:", err);},
      complete: () => {
        console.log("Checkout complete");
      }
    });
   
  }
}
