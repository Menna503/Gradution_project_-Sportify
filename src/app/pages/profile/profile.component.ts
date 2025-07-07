import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/authservice/auth.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent , RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.signout();
    this.router.navigate(['/home'], { replaceUrl: true });
    localStorage.removeItem('cart');
  }
}
