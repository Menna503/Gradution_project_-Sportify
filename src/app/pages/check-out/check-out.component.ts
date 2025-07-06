import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductService } from '../../services/products/product.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/products/cart.service';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-out',
  imports: [
    FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckOutComponent implements OnInit, OnDestroy {
  cartProducts: any[] = [];
  totalPrice: number = 0;
  user_id: string = localStorage.getItem('UserId') || '';
  cartSub!: Subscription;
  submitted = false;

  constructor(
    private cartService: CartService,
    private authservice: AuthService,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSub = this.cartService.cartItems$.subscribe((updatedCart) => {
      this.cartProducts = updatedCart;
      this.cdr.detectChanges();

      if (this.cartProducts.length === 0) {
        console.log('Cart is empty!');
      }
    });

    this.authservice.getuser(this.user_id).subscribe({
      next: (data: any) => {
        const user = data.data.user;

        if (user.cart && Array.isArray(user.cart)) {
          this.cartService.setCart(user.cart);
        }

        this.Form.patchValue({
          name: user.firstName || '',
          email: user.email || '',
        });
      },
      error: (err) => console.log(err),
    });

    this.orderService.getMyOrders().subscribe({
      next: (res: any) => {
        const orders = res.orders;
        if (orders.length > 0) {
          const lastOrder = orders[0];
          const address = lastOrder.shippingAddress;

          if (address) {
            this.Form.patchValue({
              address: address.address || '',
              city: address.city || '',
              postalCode: address.postalCode || '',
              phone: address.phone || '',
              country: address.country || '',
            });
          }
        }
      },
      error: (err) => console.log('Failed to fetch orders', err),
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
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(010|011|012|013|015)\d{8}$/),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    city: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    postalCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d{3,10}$/),
    ]),
    country: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  get NameValid() {
    return this.Form.controls['name'].valid;
  }

  get EmailValid() {
    return this.Form.controls['email'].valid;
  }

  get PhoneValid() {
    return this.Form.controls['phone'].valid;
  }

  get AddressValid() {
    return this.Form.controls['address'].valid;
  }

  get CityValid() {
    return this.Form.controls['city'].valid;
  }

  get PostalCodeValid() {
    return this.Form.controls['postalCode'].valid;
  }

  get CountryValid() {
    return this.Form.controls['country'].valid;
  }

  submit() {
    this.submitted = true;
    console.log('Form validity:', this.Form.valid);

    if (this.Form.valid) {
      this.Form.markAllAsTouched();

      const shippingAddress = {
        address: this.Form.controls['address'].value,
        city: this.Form.controls['city'].value,
        postalCode: this.Form.controls['postalCode'].value,
        phone: this.Form.controls['phone'].value,
        country: this.Form.controls['country'].value,
      };

      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
      console.log('Shipping Address saved:', shippingAddress);

      this.router.navigate(['/payment']);
    } else {
      console.log(
        'Form is invalid. Please fill in all required fields correctly.'
      );
    }
  }
}
