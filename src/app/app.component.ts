import { Component, ErrorHandler } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { SigninComponent } from './pages/signin/signin.component';
import { HomeComponent } from "./pages/home/home.component";
import { MenComponent } from "./pages/men/men.component";
import { WomenComponent } from './pages/women/women.component';
import { SuplementsComponent } from './pages/suplements/suplements.component';
import { FooterComponent } from './components/footer/footer.component';
import { PartnersComponent } from './components/partners/partners.component';
import { CartComponent } from "./components/cart/cart.component";
import { ReviewcardComponent } from './components/reviewcard/reviewcard.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FavComponent } from './pages/fav/fav.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConfirmPaymentComponent } from './pages/confirm-payment/confirm-payment.component';
import { CheckOutComponent } from "./pages/check-out/check-out.component";
import { GlobalErrorHandler } from './services/error_handler/error-service.service';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';

@Component({
  selector: 'app-root',
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],

  imports: [
    RouterOutlet,
    CommonModule,
    FavComponent,
    PaymentPageComponent, 
    CheckOutComponent,
    HomeComponent,
    MenComponent,
    WomenComponent,
    SuplementsComponent,
    FooterComponent,
    PartnersComponent, 
    HeaderComponent,
    ConfirmPaymentComponent,
    PaginationComponent,
    HttpClientModule,
    SignupPageComponent,
    SigninComponent,
    CartComponent,
    CartPageComponent,
    ProductDetailsComponent,
    ProfileComponent
  ],


  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sports';

 

  constructor(private router: Router) {
    
  }
  ngOnInit() {
   

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
   

 
}
