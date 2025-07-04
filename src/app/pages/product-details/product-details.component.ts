import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ReviewcardComponent } from '../../components/reviewcard/reviewcard.component';
import { CartComponent } from '../../components/cart/cart.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/products/product.service';
import { MenCollectionComponent } from '../../components/image-collection/men-collection.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { CartService } from '../../services/products/cart.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { AdminService } from '../../services/admin.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ReviewcardComponent,
    ReactiveFormsModule,
    FormsModule,
    CartComponent,
    CommonModule,
    RouterModule,
    LoadingComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  providers: [ProductService],
})
export class ProductDetailsComponent implements OnInit {
  ID: string = '';
  isFav: boolean = false;
  showConfirmModal: boolean = false;
  productId: string = '';
  isLoading: boolean = false;
  @Output() removedFromFavorites = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private adminService: AdminService
  ) {
    this.ID = activatedRoute.snapshot.params['id'];
  }

  products: any;
  reviews: any;
  quantity: number = 1;
  selectedSize: string | null = null;
  showSizeMessage: boolean = false;
  showQuantityMessage: boolean = false;
  isAdded: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.checkIfFavorite();
    this.productService.getProductById(this.ID).subscribe({
      next: (data) => {
        this.products = data;
        console.log(this.products);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('completed');
      },
    });

    this.productService.getReviewsById(this.ID).subscribe({
      next: (data: any) => {
        this.reviews = data?.data?.reviews || [];
        console.log('Reviews:', this.reviews);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Reviews fetch completed');
      },
    });
  }

  checkIfFavorite() {
    this.favoritesService.getfavourite().subscribe({
      next: (favourites) => {
        this.isFav = favourites.some(
          (fav) => fav.id === this.products?.data?.product?._id
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  togglefav() {
    if (!this.isFav) {
      this.favoritesService.addFavorite(this.products?.data).subscribe({
        next: () => {
          console.log(`${this.products?.data?._id} is added`);
          this.isFav = true;
        },
        error: (err) => console.error('Error adding to favorites:', err),
      });
    } else {
      this.favoritesService.removeFavorite(this.products?.data?._id).subscribe({
        next: () => {
          console.log(`${this.products?.data?._id} is removed`);
          this.isFav = false;
          this.removedFromFavorites.emit(this.products?.data?._id);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  Form = new FormGroup({
    user: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    reviewerEmail: new FormControl(null, [
      Validators.required,
      Validators.email,
    ]),
    review: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    rating: new FormControl(null, [Validators.required]),
  });
  get EmailValid() {
    return this.Form.controls['reviewerEmail'].valid;
  }
  get NameValid() {
    return this.Form.controls['user'].valid;
  }
  get DescriptionValid() {
    return this.Form.controls['review'].valid;
  }
  get RateValid() {
    return this.Form.controls['rating'].valid;
  }
  rating: number = 1;

  updateRating(value: number) {
    this.rating = value;
  }

  submitted = false;
  @Output() myEvent = new EventEmitter();
  submit() {
    this.submitted = true;

    if (this.Form.valid) {
      const productId = this.ID;

      let newReview = {
        review: this.Form.get('review')?.value,
        rating: this.Form.get('rating')?.value,
      };

      this.productService.addNewReview(productId, newReview).subscribe({
        next: (response: any) => {
          console.log('Review added successfully', response);
          this.myEvent.emit(newReview);
          this.reviews.unshift(response.data);
          this.submitted = false;
          this.Form.reset();

          this.productService.getReviewsById(this.ID).subscribe({
            next: (data: any) => {
              this.reviews = data?.data?.reviews || [];
              console.log('Updated Reviews:', this.reviews);
            },
            error: (err) => {
              console.log(err);
            },
          });
        },
        error: (err) => {
          console.log('Error adding Review:', err);
        },
      });
    } else if (this.Form.valid) {
      this.Form.markAllAsTouched();
      return;
    }
  }
  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  selectSize(size: string) {
    this.selectedSize = size;
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }
  confirmDelete(productId: string) {
    this.productId = productId;
    this.showConfirmModal = true;
  }

  deleteCurrentProduct() {
    this.adminService.deleteProduct(this.ID).subscribe({
      next: (response) => {
        console.log('Product deleted successfully', response);
        this.router.navigate(['/home']);
        this.showConfirmModal = false;
      },
      error: (err) => {
        console.error('Error occurred:', err);
        this.showConfirmModal = false;
      },
    });
  }
  togleDel() {
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.showConfirmModal = false;
  }

  toggleEdit() {
    this.router.navigate(['/admin-edit', this.ID]);
  }

  addToCart() {
    if (
      this.products?.data?.category?.name === 'equipment' ||
      this.products?.data?.category?.name === 'supplement'
    ) {
      console.log('Nosize');
      this.selectedSize = 'Nosize';
    }
    if (!this.selectedSize) {
      console.error('Please select a size before adding to cart.');
      this.showSizeMessage = true;
      return;
    } else {
      const productData = {
        productId: this.products?.data?.product?._id,
        quantity: this.quantity,
        selectedSize: this.selectedSize,
      };

      this.cartService
        .addToCart(this.products?.data?.product?._id, this.quantity, this.selectedSize)
        .subscribe(
          (response) => {
            console.log('Product added to cart:', response);
            this.isAdded = true;
            this.router.navigate(['/cart']);
          },
          (error) => {
            console.error('Error adding product to cart:', error);
          }
        );
    }
  }
}
