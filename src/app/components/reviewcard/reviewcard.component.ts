import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { ProductService } from '../../services/products/product.service';
import { ProductDetailsComponent } from '../../pages/product-details/product-details.component';

@Component({
  selector: 'app-reviewcard',
  imports: [CommonModule,RouterModule,ProductDetailsComponent],
  templateUrl: './reviewcard.component.html',
  styleUrl: './reviewcard.component.css',
  providers:[ProductService]
})
export class ReviewcardComponent {
 

}
