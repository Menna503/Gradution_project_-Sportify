import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-orders',
  imports: [CommonModule , RouterModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent {
orders = [
  {
    id: '#3658944',
    date: '11/2/2025',
    status: 'In Progress',
    items: '3 Items',
    total: '2300.00$'
  },
  {
    id: '#7894561',
    date: '15/3/2025',
    status: 'Delivered',
    items: '2 Items',
    total: '1700.00$'
  },
  {
    id: '#1237896',
    date: '20/4/2025',
    status: 'Processing',
    items: '5 Items',
    total: '2900.00$'
  },
  {
    id: '#1237896',
    date: '20/4/2025',
    status: 'Processing',
    items: '5 Items',
    total: '2900.00$'
  }
  ,
  {
    id: '#1237896',
    date: '20/4/2025',
    status: 'Processing',
    items: '5 Items',
    total: '2900.00$'
  }
  ,
  {
    id: '#1237896',
    date: '20/4/2025',
    status: 'Processing',
    items: '5 Items',
    total: '2900.00$'
  }
  ,
  {
    id: '#1237896',
    date: '20/4/2025',
    status: 'Processing',
    items: '5 Items',
    total: '2900.00$'
  },
  {
    id: '#1237896',
    date: '20/4/2025',
    status: 'Processing',
    items: '5 Items',
    total: '2900.00$'
  }
];
}
