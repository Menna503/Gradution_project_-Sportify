import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-dtails',
  imports: [RouterModule ,CommonModule],
  templateUrl: './order-dtails.component.html',
  styleUrl: './order-dtails.component.css'
})
export class OrderDtailsComponent {
constructor(private route: ActivatedRoute) {}

ngOnInit() {
  const orderId = this.route.snapshot.paramMap.get('id');
  console.log('Order ID:', orderId);

}
  rows = [
  { id: 1, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 2, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 3, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 4, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 5, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  
];
}
