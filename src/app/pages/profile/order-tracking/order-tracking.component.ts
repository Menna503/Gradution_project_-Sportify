import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/auth/user.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css'] ,
   imports: [
    CommonModule, 
  ]
})
export class OrderTrackingComponent {
 orders: any[] = [];
 userData: any = {}; 
 isLoading = true;
 statusSteps = ['placed', 'processing', 'shipped', 'delivered'];

 constructor(private orderService: OrderService ,private userService: UserService) {}
 

ngOnInit(): void {
  this.orderService.getMyOrders().subscribe({
    next: (res) => {
      console.log('Full Orders Response:', res);
      this.orders =  res.orders; 
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Failed to load orders', err);
      this.isLoading = false;
    },
  });

   this.userService.getUserData().subscribe((data :any) => {
      if (data) {
        this.userData = data;
      }
    });
}

  getStepClass(currentStatus: string, step: string): string {
    const currentIndex = this.statusSteps.indexOf(currentStatus?.toLowerCase());
    const stepIndex = this.statusSteps.indexOf(step.toLowerCase());
    return stepIndex <= currentIndex ? 'step step-neutral w-50' : 'step w-50';
  }
}

