import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/products/cart.service';
import { ProductService } from '../../services/products/product.service';

export interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
  category: {
    name: string;
  };
  size_range: string[];
}

export interface CartProduct {
  product: Product;
  size: string;
  quantity: number;
}

export interface CartUpdate {
  productId: string;
  currentSize: string;
  newSize?: string;
  quantity?: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  @Input() product!: CartProduct;
  @Output() quantityChanged = new EventEmitter<void>();
  @Output() productDeleted = new EventEmitter<string>();
  @Output() productUpdated = new EventEmitter<CartUpdate>();

  originalSize: string = '';
  originalQuantity: number = 1;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.originalSize = this.product.size;
    this.originalQuantity = this.product.quantity;
  }
  increaseQuantity() {
    console.log(this.product.quantity, 88888888);

    this.product.quantity++;
    this.updateQuantity();
  }

  decreaseQuantity() {
    console.log(this.product.quantity, 88888888);

    if (this.product.quantity > 1) {
      this.product.quantity--;
    }
    this.updateQuantity();
  }

  onQuantityInputBlur() {
    if (this.product.quantity < 1) {
      this.product.quantity = 1;
    }
  }

  updateQuantity() {
    console.log(this.product.quantity, 88888888);

    this.cartService
      .updateQuantity(
        this.product.product._id,
        this.product.quantity,
        this.product.size
      )
      .subscribe({
        next: () => {
          this.originalQuantity = this.product.quantity;
          this.emitProductUpdate({ quantity: this.product.quantity });
        },
        error: (err) => console.error('Failed to update quantity:', err),
      });
  }

  selectSize(newSize: string) {
    console.log(22222222);
    if (newSize !== this.originalSize) {
      const update = {
        productId: this.product.product._id,
        currentSize: this.originalSize,
        newSize,
        quantity: this.product.quantity,
      };

      this.cartService.updateCart([update]).subscribe({
        next: () => {
          this.product.size = newSize;
          this.originalSize = newSize;
        },
        error: (err) => console.error('Size update failed', err),
      });
    }
  }

  deleteProduct() {
    this.cartService
      .removeFromCart(this.product.product._id, this.product.size)
      .subscribe({
        next: () => this.productDeleted.emit(this.product.product._id),
        error: (err) =>
          console.error('Failed to delete product from cart:', err),
      });
  }

  private emitProductUpdate(changes: Partial<CartUpdate>) {
    this.productUpdated.emit({
      productId: this.product.product._id,
      currentSize: this.originalSize,
      ...changes,
    });
  }
}
