import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/auth/user.service';

@Component({
  selector: 'app-order-dtails',
  imports: [RouterModule ,CommonModule],
  templateUrl: './order-dtails.component.html',
  styleUrl: './order-dtails.component.css'
})
export class OrderDtailsComponent {
  userData: any = {};
  orderId: string | null = null;
  selectedOrder: any;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

   ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');

    this.userService.getUserData().subscribe((data: any) => {
      if (data) {
        this.userData = data;

        this.selectedOrder = this.userData.orders.find((order: any) => order._id === this.orderId);
        console.log('Selected Order:', this.selectedOrder);
      }
    });
  }
}
