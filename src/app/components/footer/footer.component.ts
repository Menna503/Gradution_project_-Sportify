import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goMen() {
    this.router.navigate(['/men']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goWomen() {
    this.router.navigate(['/women']);
  }

  goSupplement() {
    this.router.navigate(['/supplements']);
  }

  goEquipment() {
    this.router.navigate(['/equipment']);
  }

  goShoes() {
    this.router.navigate(['/shoes']);
  }
}