import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css'] ,
   imports: [
    CommonModule, 
  ]
})
export class OrderTrackingComponent {
  userDetails = [
    { label: 'Name', value: 'Ghada Elsayed Abo Elfetouh' },
    { label: 'Phone', value: '+20 123 456 789' },
    { label: 'Address', value: 'Cairo, Egypt' },
    { label: 'Email', value: 'ghada@example.com' },
     { label: 'Payment Method', value: 'Visa Card' }
  ];
  rows = [
  { id: 1, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 2, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 3, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 4, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 5, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },
  { id: 6, name: 'Hodes N33', price: 200, size: 'XL', color: 'Red', qty: 2, total: 400 },

  
];
}
