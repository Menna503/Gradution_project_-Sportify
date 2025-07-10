import { RouterModule, Routes } from '@angular/router';
import { FavComponent } from './pages/fav/fav.component';
import { HomeComponent } from './pages/home/home.component';
import { MenComponent } from './pages/men/men.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { SuplementsComponent } from './pages/suplements/suplements.component';
import { WomenComponent } from './pages/women/women.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { Component, NgModule } from '@angular/core';
import { CheckOutComponent } from './pages/check-out/check-out.component';
import { EquipmentComponent } from './pages/equipment/equipment.component';
import { ShoesComponent } from './pages/shoes/shoes.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { ErrorComponent } from './pages/error/error.component';
import { GuardService } from './services/auth/authGaurd/guard.service';
import { ConfirmPaymentComponent } from './pages/confirm-payment/confirm-payment.component';
import { AdminAddProductComponent } from './components/admin-add-product/admin-add-product.component';
import { AdminEditProductComponent } from './components/admin-edit-product/admin-edit-product.component';
import { AllProductsComponent } from './pages/all-products/all-products.component';
import { NoAuthGuard } from './services/auth/authGaurd/no-auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderTrackingComponent } from './pages/profile/order-tracking/order-tracking.component';
import { AllOrdersComponent } from './pages/profile/all-orders/all-orders.component';
import { PersonalInfoComponent } from './pages/profile/personal-info/personal-info.component';
import { OrderDtailsComponent } from './pages/profile/all-orders/order-dtails/order-dtails.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { FailedPaymentComponent } from './failed-payment/failed-payment.component';
import { ConfirmOrderGuard } from './guards/confirm-order.guard';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // {path:'login' ,component:SigninComponent},
  // {path:'signup' ,component:SignupPageComponent},
  { path: 'fav', component: FavComponent, canActivate: [GuardService] },
   {path: 'profile',
      component: ProfileComponent,
      canActivate: [GuardService],
      children: [
        { path: 'order-tracking', component: OrderTrackingComponent },
        { path: 'all-orders', component: AllOrdersComponent },
        { path: 'all-orders/:id', component: OrderDtailsComponent},
        { path: 'personal-info', component: PersonalInfoComponent },
        { path: '', redirectTo: 'order-tracking', pathMatch: 'full' }
      ]
    },
  { path: 'products', component: AllProductsComponent },
  { path: 'men', component: MenComponent },
  { path: 'women', component: WomenComponent },
  { path: 'equipment', component: EquipmentComponent },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    canActivate: [GuardService],
  },
  {
    path: 'payment',
    component: PaymentPageComponent,
    canActivate: [GuardService],
  },
  {
    path: 'checkout',
    component: CheckOutComponent,
    canActivate: [GuardService],
  },
  { path: 'shoes', component: ShoesComponent },
  { path: 'allProduct', component: AllProductsComponent },
  { path: 'supplements', component: SuplementsComponent },
  { path: 'cart', component: CartPageComponent, canActivate: [GuardService] },
  { path: 'confirmPayment', component: ConfirmPaymentComponent },
  {
    path: 'confirm-order',
    component: ConfirmOrderComponent,
    canActivate: [ConfirmOrderGuard],
  },
  { path: 'decline-order', component: FailedPaymentComponent },
  {
    path: 'admin',
    component: AdminAddProductComponent,
    canActivate: [GuardService],
  },
  { path: 'admin-edit/:id', component: AdminEditProductComponent },
  { path: 'error', component: ErrorComponent },
  {
    path: 'login',
    component: SigninComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'signup',
    component: SignupPageComponent,
    canActivate: [NoAuthGuard],
  },
   { path: '**', component: NotFoundComponent }  

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],

  exports: [RouterModule],
})
export class AppRoutingModule {}
