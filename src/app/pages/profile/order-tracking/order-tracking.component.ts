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
    { label: 'Email', value: 'ghada@example.com' }
  ];
}
