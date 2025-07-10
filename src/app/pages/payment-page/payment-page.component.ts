import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/products/cart.service';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css',
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  cartProducts: any[] = [];
  selectedMethod: 'cash' | 'visa' | null = null;
  cartSub!: Subscription;
  showCashConfirmation = false;
  isPlacingOrder = false;
  isRedirectingToStripe = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      localStorage.setItem('stripeSessionId', sessionId);
    }

    this.cartSub = this.cartService.cartItems$.subscribe((updatedCart) => {
      this.cartProducts = updatedCart;
      this.cdr.detectChanges();
    });
  }

  get total(): number {
    const storedTotal = localStorage.getItem('totalPrice');
    return storedTotal ? Number(storedTotal) : 0;
  }

  get cartIsEmpty(): boolean {
    return this.cartProducts.length === 0;
  }

  selectMethod(method: 'cash' | 'visa'): void {
    this.selectedMethod = method;
  }

  triggerCashConfirmation(): void {
    if (this.cartIsEmpty) {
      this.router.navigate(['/']);
      return;
    }
    this.showCashConfirmation = true;
  }

  payCash(): void {
    if (localStorage.getItem('stripePaid') === 'true') {
      this.toastr.warning('You already completed payment. Confirm the order.');

      this.router.navigate([`/confirm-order`], {
        queryParams: { session_id: localStorage.getItem('session_id') },
      });

      return;
    }
    this.isPlacingOrder = true;
    const address = this.getShippingDetailsFromLocalStorage();
    if (!address) {
      this.toastr.error('Missing shipping details.', 'Error');
      this.router.navigate(['/decline-order']);
      this.isPlacingOrder = false;
      return;
    }

    this.paymentService
      .confirmOrder({
        paymentMethod: 'cash',
        shippingAddress: address,
      })
      .subscribe({
        next: () => {
          this.clearCartData();
          this.toastr.success('Order placed successfully!', 'Success');
          this.showCashConfirmation = false;
          this.isPlacingOrder = false;
          this.router.navigate(['/confirmPayment']);
        },
        error: (err) => {
          console.error(err);
          console.log(err);
          this.toastr.error(`Order failed ${err.message}`, 'Error');
          this.showCashConfirmation = false;
          this.isPlacingOrder = false;
          this.router.navigate(['/decline-order']);
        },
      });
  }

  redirectToStripe(): void {
    if (this.cartIsEmpty) {
      this.router.navigate(['/']);
      return;
    }

    if (localStorage.getItem('stripePaid') === 'true') {
      this.toastr.warning('You already completed payment. Confirm the order.');

      this.router.navigate([`/confirm-order`], {
        queryParams: { session_id: localStorage.getItem('session_id') },
      });

      return;
    }

    this.isRedirectingToStripe = true;

    this.paymentService.checkout('visa').subscribe({
      next: (res) => {
        this.isRedirectingToStripe = false;
        if (res.checkoutSessionUrl) {
          window.location.href = res.checkoutSessionUrl;
        } else {
          this.toastr.error('Failed to initiate Stripe Checkout.', 'Error');
          this.router.navigate(['/decline-order']);
        }
      },
      error: () => {
        this.isRedirectingToStripe = false;
        this.toastr.error('Stripe Checkout failed.', 'Error');
        this.router.navigate(['/decline-order']);
      },
    });
  }

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

  clearCartData(): void {
    localStorage.removeItem('totalPrice');
    this.cartService.clearCart();
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}
