import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/authservice/auth.service';
import { UserService } from '../../../services/auth/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal-info',
  imports: [CommonModule , FormsModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {
  userData: any = {}; 
  editData: any = {};
 toastMessage: string = '';
 toastType: 'success' | 'error' = 'success';
constructor(private userService: UserService ,private authService : AuthService) {}

 ngOnInit(): void {
    this.userService.getUserData().subscribe((data: any) => {
      if (data) {
        this.userData = data;
        this.editData = {
          firstName: data.firstName,
          lastName: data.lastName
        };
      }
    });
  }

  fetchUserData() {
  const userId = localStorage.getItem('UserId') || '';
  this.authService.getuser(userId).subscribe((data: any) => {
    this.userData = data;
    this.editData = {
      firstName: data.firstName,
      lastName: data.lastName
    };
  });
}

 updateUserInfo() {
  
  const userId = localStorage.getItem('UserId') || '';
  this.authService.updateUser(userId, this.editData).subscribe(
    () => {
      this.userData.firstName = this.editData.firstName;
      this.userData.lastName = this.editData.lastName;
      this.showToast('Updated Successfully!', 'success');
    },
    (error) => {
      this.showToast('Failed to update. Try again.', 'error');
    }
  );
}

showToast(message: string, type: 'success' | 'error') {
  this.toastMessage = message;
  this.toastType = type;

  setTimeout(() => {
    this.toastMessage = '';
  }, 3000);
}
}
