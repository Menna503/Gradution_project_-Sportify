import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../services/products/cart.service';
import { ProductService } from '../../services/products/product.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  isHiddenPage: boolean = false;
  @Input() data: any;
  @Input() isFav: boolean = false;
  @Output() removedFromFavorites = new EventEmitter<string>();

  selectedColor: string = '';
  selectedSize: string = '';
  isAdded: boolean = false;

  showLoginPrompt: boolean = false; // 🟢 ده الجديد

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private favoritesService: FavoritesService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.selectedSize = this.data.size_range[0];
    this.checkCurrentRoute();
    this.checkIfFavorite();
  }

  checkCurrentRoute() {
    const currentUrl = this.router.url;
    this.isHiddenPage =
      currentUrl.includes('equipment') ||
      currentUrl.includes('supplements') ||
      this.data.category?.name == 'supplement' ||
      this.data.category?.name == 'equipment';
  }

  checkIfFavorite() {
    this.favoritesService.getfavourite().subscribe({
      next: (favourites) => {
        this.isFav = favourites.some((fav) => fav.id == this.data.id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleFav() {
    if (!this.isFav) {
      this.favoritesService.addFavorite(this.data).subscribe({
        next: () => {
          console.log(`${this.data.id} is added`);
          this.isFav = true;
        },
        error: (err) => console.error('Error while adding to favorites:', err),
      });
    } else {
      this.favoritesService.removeFavorite(this.data.id).subscribe({
        next: () => {
          console.log(`${this.data.id} is removed`);
          this.isFav = false;
          this.removedFromFavorites.emit(this.data.id);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  addToCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginPrompt = true; // 👈 يظهر المودال
      return;
    }

    this.cartService.addToCart(this.data._id, 1, this.selectedSize).subscribe(
      (response) => {
        console.log('Product added successfully:', response);
        this.isAdded = true;
        setTimeout(() => {
          this.isAdded = false;
        }, 1000);
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/image.png';
  }
  onImageClick(event?: MouseEvent) {
    event?.stopPropagation();
    event?.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginPrompt = true;
      return;
    }

    this.router.navigate(['/product', this.data._id]);
  }
}
