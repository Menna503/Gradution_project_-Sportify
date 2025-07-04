import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../services/products/cart.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartComponent } from '../../components/cart/cart.component';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CartUpdate } from '../../components/cart/cart.component';
import { LoadingComponent } from '../../components/loading/loading.component';
@Component({
  selector: 'app-cart-page',
  imports: [FooterComponent, HeaderComponent, CommonModule, FormsModule, CartComponent, ProductDetailsComponent,RouterModule,LoadingComponent],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartProducts: any[] = [];
  cartArr :any;
  totalPrice: number = 0;
  user_id: string = localStorage.getItem('UserId') || "";
  cartSub!: Subscription;
  isLoading: boolean = false; 

  constructor(
    private cartService: CartService,
    private authservice: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading=true;
    this.cartSub = this.cartService.cartItems$.subscribe((updatedCart) => {
      this.cartProducts = updatedCart;
      this.calculateTotal(); 
      this.cdr.detectChanges(); 
      if (this.cartProducts.length === 0) {
        console.log('Cart is empty!');
      }
    }
  );
    this.authservice.getuser(this.user_id).subscribe({
      
     next:(data:any)=>{this.cartProducts = data.data.user.cart ,this.calculateTotal(),console.log(this.cartProducts), this.isLoading=false;},
     
      error: (err) => console.log(err),
      complete: () => console.log('completed')
    });
  }

  
  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
  calculateTotal() {
    this.totalPrice = this.cartProducts.reduce((acc, item) => {
      const quantity = item.quantity || 1;
      const price = item.product?.price || 0;

      return acc + (Number(price) * quantity);
     
    }, 0);
  
    console.log("total price:", this.totalPrice);
    localStorage.setItem('totalPrice', this.totalPrice.toString());
    
  }

  checkout() {
    if (!this.user_id) {
      console.log(' No user logged in!');
      this.router.navigate(['/login']); 
      return;
    }
    this.updatedCart();
   this.calculateTotal();
    this.router.navigate(['/checkout']); 
  }

  updatedProductsMap: Map<string, CartUpdate> = new Map();

  handleCartProductUpdate(update: CartUpdate) {
    const key = `${update.productId}-${update.currentSize}`;
    this.updatedProductsMap.set(key, update);
    this.calculateTotal();
  }

  updatedCart() {
    const updatesArray = Array.from(this.updatedProductsMap.values());
    if (updatesArray.length === 0) {
      console.log("No updates to send.");
      return;
    }
  
    this.cartService.updatedCart(updatesArray).subscribe({
      next: () => console.log('Updated cart with:', updatesArray),
      error: (err) => console.log('Error updating cart:', err),
      complete: () => console.log('Completed cart update'),
    });
  }

  
}

