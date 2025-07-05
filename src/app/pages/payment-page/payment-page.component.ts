import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/products/cart.service';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-page',
  imports: [
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css',
})
export class PaymentPageComponent {
  cartProducts: any[] = [];
  totalPrice: number = 0;
  user_id: string = localStorage.getItem('UserId') || '';
  cartSub!: Subscription;

  constructor(
    private cartService: CartService,
    private authservice: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSub = this.cartService.cartItems$.subscribe((updatedCart) => {
      this.cartProducts = updatedCart;
      this.cdr.detectChanges();
      if (this.cartProducts.length === 0) {
        console.log('✅ Cart is empty!');
      }
    });
    this.authservice.getuser(this.user_id).subscribe({
      next: (data: any) => {
        (this.cartProducts = data.data.user.cart),
          console.log(this.cartProducts);
      },

      error: (err) => console.log(err),
      complete: () => console.log('completed'),
    });
  }

  get total(): number {
    const storedTotal = localStorage.getItem('totalPrice');
    return storedTotal ? Number(storedTotal) : 0;
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  Form = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    date: new FormControl(null, [Validators.required]),
    card_num: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/),
    ]),
    cvv: new FormControl(null, [Validators.required]),
    payment_method: new FormControl(null, [Validators.required]),
  });

  get DateValid() {
    return this.Form.controls['date'].valid;
  }
  get NameValid() {
    return this.Form.controls['name'].valid;
  }
  get card_numValid() {
    return this.Form.controls['card_num'].valid;
  }
  get cvvValid() {
    return this.Form.controls['cvv'].valid;
  }
  get payment_method() {
    return this.Form.controls['payment_method'].valid;
  }
  submitted = false;
  submit() {
    this.submitted = true;
    console.log('Form validity:', this.Form.valid);

    if (this.Form.valid) {
      this.Form.markAllAsTouched();
      this.router.navigate(['/confirmPayment']);
      console.log('Form is valid, navigating to payment...');
    } else {
      console.log(
        'Form is invalid. Please fill in all required fields correctly.'
      );
    }
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
