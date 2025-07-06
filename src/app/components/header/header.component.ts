import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/products/cart.service';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule ,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  fname:string |null='' ;
  email:string |null='';
  show:string='hidden'
  ishidden:boolean=false;
   token:string|null=null;
   data:any;
 showLoginPrompt: boolean = false;

 cartItemCount: number = 0;
 favoriteItemCount: number = 0;

  constructor(private authService:AuthService ,private router:Router,
    private cartService: CartService,  private favoritesService: FavoritesService
)
  {
    this.token=localStorage.getItem('token');
     console.log(this.token);
  }
  ngOnInit() {
     this.token=localStorage.getItem('token');
      console.log(this.token);
       this.fname=localStorage.getItem('Fname');
       this.email=localStorage.getItem('Email')

       this.cartService.cartCount$.subscribe(count => {
        console.log('Updated cart count:', count); 
        this.cartItemCount = count;
      });
    this.favoritesService.favoriteCount$.subscribe(count => {
  this.favoriteItemCount = count;
});
  }

  toggel() {
    this.show = this.show === 'hidden' ? 'block' : 'hidden';
  }
  
  getProfile(){
 
  this.ishidden=!this.ishidden
  }

  logout(){
    this.authService.signout();
    this.router.navigate(['/home'], { replaceUrl: true });
    this.token='';
    this.ishidden=false;
    localStorage.removeItem('cart'); 
  }
  
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

navigateToLogin() {
  this.router.navigate(['/login']);
}
checkLoginBeforeNavigate(category: string, event: Event) {
  const token = localStorage.getItem('token');
  if (!token) {
    event.preventDefault();
    this.showLoginPrompt = true;
    return;
  }

  // ✅ مش لازم نستخدم router.navigate هنا
  this.show = 'hidden';
}



goHome() {
    console.log('Navigating to home...');
    this.router.navigate(['/home']);
  }

}
