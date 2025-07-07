import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/products/product.service';
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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    LoadingComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  providers: [ProductService],
})
export class ProductDetailsComponent implements OnInit {
  ID: string = '';
  isFav = false;
  showConfirmModal = false;
  productId: string = '';
  isLoading = false;

  @Output() removedFromFavorites = new EventEmitter<string>();
  @Output() myEvent = new EventEmitter();

  products: any;
  reviews: any[] = [];

  quantity = 1;
  selectedSize: string | null = null;
  availableStock: number | null = null;
  originalStock: number | null = null;

  showSizeMessage = false;
  isAdded = false;
  submitted = false;

  Form = new FormGroup({
    // user: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    // reviewerEmail: new FormControl(null, [Validators.required, Validators.email]), // تم الحذف
    review: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    rating: new FormControl(null, [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    this.ID = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    
    this.isLoading = true;

    this.productService.getProductById(this.ID).subscribe({
      next: (data) => {
        this.products = data;
        this.checkIfFavorite();

        const savedSize = localStorage.getItem(`selectedSize_${this.ID}`);
        const savedQuantity = localStorage.getItem(`quantity_${this.ID}`);

        if (savedSize) {
          this.selectedSize = savedSize;
          const stockBySize = this.products?.data?.product?.stock_by_size || {};
          this.availableStock = stockBySize[this.selectedSize] ?? 0;
          this.originalStock = this.availableStock;
          this.quantity = savedQuantity ? +savedQuantity : 1;
        } else {
          this.availableStock = this.products?.data?.product?.stock ?? 0;
          this.originalStock = this.availableStock;
          this.quantity = 1;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });

    this.loadReviews();
  }

  loadReviews() {
    this.productService.getReviewsById(this.ID).subscribe({
      next: (data: any) => {
        this.reviews = data?.data?.reviews || [];
      },
      error: (err) => {
        console.error(err);
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
        console.error(err);
      },
    });
  }

  togglefav() {
    const productId = this.products?.data?.product?._id;

    if (!this.isFav) {
      this.favoritesService.addFavorite(productId).subscribe({
        next: () => {
          this.isFav = true;
          console.log('Added to favorites:', productId);
        },
        error: (err) => console.error('Error adding to favorites:', err),
      });
    } else {
      this.favoritesService.removeFavorite(productId).subscribe({
        next: () => {
          this.isFav = false;
          this.removedFromFavorites.emit(productId);
          console.log('Removed from favorites:', productId);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
    this.showSizeMessage = false;
    this.quantity = 1;

    const stockBySize = this.products?.data?.product?.stock_by_size || {};
    this.availableStock = stockBySize[this.selectedSize] ?? 0;
    this.originalStock = this.availableStock;

    localStorage.setItem(`selectedSize_${this.ID}`, size);
    localStorage.setItem(`quantity_${this.ID}`, this.quantity.toString());
  }

  increaseQuantity() {
    if (this.originalStock !== null && this.quantity < this.originalStock) {
      this.quantity++;
      this.availableStock = (this.availableStock ?? 0) - 1;
      localStorage.setItem(`quantity_${this.ID}`, this.quantity.toString());
    } else {
      alert('Out of stock for this size.');
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      if (
        this.availableStock !== null &&
        this.availableStock < (this.originalStock ?? 0)
      ) {
        this.availableStock++;
      }
      localStorage.setItem(`quantity_${this.ID}`, this.quantity.toString());
    }
  }

  // get NameValid(): boolean {
  //   return this.Form.controls['user'].valid;
  // }

  get DescriptionValid(): boolean {
    return this.Form.controls['review'].valid;
  }

  get RateValid(): boolean {
    return this.Form.controls['rating'].valid;
  }

  //  submit() {
  //   this.submitted = true;

  //   if (this.Form.valid) {
  //     const productId = this.ID;
  //     const newReview = {
  //       review: this.Form.get('review')?.value,
  //       rating: this.Form.get('rating')?.value,
  //     };

  //     this.productService.addNewReview(productId, newReview).subscribe({
  //       next: (response: any) => {
  //         this.myEvent.emit(newReview);
  //         this.reviews.unshift(response.data);
  //         this.Form.reset();
  //         this.submitted = false;
  //         this.loadReviews();
  //         this.toastr.success('Review added successfully!', 'Success');
  //       },
  //       error: (err) => {
  //         console.error('Review submission error:', err);

  //         const errorMessage =
  //           err?.error?.message ||  // لو الباك بيرجع { message: "..." }
  //           err?.error?.error ||    // لو الباك بيرجع { error: "..." }
  //           err?.error?.errors?.[0]?.msg || // لو في array من الأخطاء
  //           err?.message ||          // Fallback من Angular
  //           'Error adding review.';  // رسالة عامة

  //         this.toastr.error(errorMessage, 'Error');
  //       },
  //     });
  //   } else {
  //     this.Form.markAllAsTouched();
  //   }
  // }
  submit() {
    this.submitted = true;

    if (this.Form.valid) {
      const productId = this.ID;
      const newReview = {
        review: this.Form.get('review')?.value,
        rating: this.Form.get('rating')?.value,
      };

      this.productService.addNewReview(productId, newReview).subscribe({
        next: (response: any) => {
          this.myEvent.emit(newReview);
          this.reviews.unshift(response.data);
          this.Form.reset();
          this.submitted = false;
          this.loadReviews();
          this.toastr.success('Review added successfully!', 'Success');
        },
        error: (err) => {
          // console.error('🔴 Review submission error:', err);
          // console.log('🔴 Full error object:', err?.error);

          let errorMessage = 'You already reviewed this product';

          if (err?.error) {
            if (typeof err.error === 'string') {
              errorMessage = err.error;
            } else if (err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error.error) {
              errorMessage = err.error.error;
            } else if (
              Array.isArray(err.error.errors) &&
              err.error.errors[0]?.msg
            ) {
              errorMessage = err.error.errors[0].msg;
            }
          }

          this.toastr.error(errorMessage, 'error');
          this.Form.reset();

          this.submitted = false;
        },
      });
    } else {
      this.Form.markAllAsTouched();
    }
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
      next: () => {
        this.router.navigate(['/home']);
        this.showConfirmModal = false;
      },
      error: (err) => {
        // console.error('Error occurred:', err);
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
      this.products?.data?.product?.category?.name === 'equipment' ||
      this.products?.data?.product?.category?.name === 'supplement'
    ) {
      this.selectedSize = 'Nosize';
    }

    if (!this.selectedSize) {
      this.showSizeMessage = true;
      return;
    }

    if (this.quantity > (this.originalStock ?? 0)) {
      alert('Quantity exceeds available stock');
      return;
    }

    this.cartService
      .addToCart(
        this.products?.data?.product?._id,
        this.quantity,
        this.selectedSize
      )
      .subscribe({
        next: () => {
          this.isAdded = true;
          localStorage.removeItem(`selectedSize_${this.ID}`);
          localStorage.removeItem(`quantity_${this.ID}`);
          this.router.navigate(['/cart']);
        },
        error: (error) => {
          console.error('Error adding product to cart:', error);
        },
      });
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/image.png';
  }

isOutOfStock(): boolean {
  const product = this.products?.data?.product;

  // لو المنتج من الملابس أو الأحذية، نستخدم stock_by_size
  if (product?.category?.name === 'clothes' || product?.category?.name === 'shoes') {
    const stockBySize = product?.stock_by_size;
    if (!stockBySize) return false;

    return Object.values(stockBySize).every(val => Number(val) === 0);
  }

  // لباقي المنتجات (equipment, supplement مثلاً)
  return Number(product?.stock) === 0;
}


}
