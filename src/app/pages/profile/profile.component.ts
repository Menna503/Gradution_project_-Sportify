import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { UserService } from '../../services/auth/user.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent , RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
   userData: any = {}; 
  constructor(
    private authService: AuthService,
    private router: Router,
     private userService: UserService,
  ) {}

  logout() {
    this.authService.signout();
    this.router.navigate(['/home'], { replaceUrl: true });
    localStorage.removeItem('cart');
  }


  ngOnInit(): void {
  const userId = localStorage.getItem('UserId');
  if (userId) {
    this.authService.getuser(userId).subscribe({
      next: (res: any) => {
        this.userData = res.data.user;
        console.log(res.data.user);
        this.userService.setUserData(this.userData); 
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });
  }
}
}
