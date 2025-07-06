import { ChangeDetectorRef, Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductService } from '../../services/products/product.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/products/cart.service';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-check-out',
  imports: [FooterComponent ,HeaderComponent,ReactiveFormsModule,RouterModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent {
  cartProducts: any[] = [];
      totalPrice: number = 0;
    
      user_id: string = localStorage.getItem('UserId') || "";
      cartSub!: Subscription;
     

      constructor(
        private cartService: CartService,
        private authservice: AuthService,
        private cdr: ChangeDetectorRef,
        private router: Router
      ) {}
    
ngOnInit() {
  // ⬅️ اقرأ الاسم من localStorage
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString);
      if (user?.name) {
        this.Form.get('name')?.setValue(user.name);
      }
    } catch (e) {
      console.error('Invalid user JSON:', e);
    }
  }

  // ⬅️ اشترك في تحديثات سلة الشراء
  this.cartSub = this.cartService.cartItems$.subscribe((updatedCart) => {
    this.cartProducts = updatedCart;
    this.cdr.detectChanges();
    if (this.cartProducts.length === 0) {
      console.log('Cart is empty!');
    }
  });

  // ⬅️ تحميل بيانات المستخدم من الـ API
  this.authservice.getuser(this.user_id).subscribe({
    next: (data: any) => {
      this.cartProducts = data.data.user.cart;
    },
    error: (err) => console.log(err),
    complete: () => console.log('completed')
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
    name: new FormControl(null, [Validators.required,Validators.minLength(3)]),
    email: new FormControl(null,[Validators.required,Validators.email]),
    phone: new FormControl(null,[Validators.required,Validators.minLength(11), Validators.maxLength(11),Validators.pattern(/^\d{11}$/)]),
    address: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(100)])
    
  })

  get EmailValid(){
    return this.Form.controls['email'].valid;
  }
  get NameValid(){
    return this.Form.controls['name'].valid;
  }
  get PhoneValid(){
    return this.Form.controls['phone'].valid;
  }
  get AddressValid(){
    return this.Form.controls['address'].valid;

  }
  submitted = false;
  submit() {
    this.submitted = true;
    console.log('Form validity:', this.Form.valid);
  
    if (this.Form.valid) {
      this.Form.markAllAsTouched(); 
      console.log('Form values:', this.Form.value);
      localStorage.setItem('address',this.Form.controls.address.value || '');
      console.log('address value:', this.Form.controls.address.value);
      this.router.navigate(['/payment']);
      console.log('Form is valid, navigating to payment...');
    } else {
      console.log('Form is invalid. Please fill in all required fields correctly.');
    }
  }
   
  
 

}
