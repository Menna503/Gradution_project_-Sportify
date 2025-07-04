import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router ,RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule ,ValidationErrors ,AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth/authservice/auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ,RouterModule], 
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  isvisble =false;
  isvisble2 =false;
  toggleEye(){
    this.isvisble=!this.isvisble
  }
  toggleEye2(){
    this.isvisble2=!this.isvisble2
  }
  signUpPage = new FormGroup({
    firstName: new FormControl('', [Validators.minLength(3), Validators.required]),
    lastName: new FormControl('', [Validators.minLength(3), Validators.required]),
    email: new FormControl('', [ Validators.required ,Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
   passwordConfirm: new FormControl('', Validators.required),
    rememberMe: new FormControl(false) 
  }, {validators:this.passwordMatch});

  passwordMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
  
    if (!password || !confirmPassword) return null;
  
    if (confirmPassword.value !== password.value) {
      confirmPassword.setErrors({ passwordsDoNotMatch: true }); // إضافة الخطأ
      return { passwordsDoNotMatch: true };
    } else {
      confirmPassword.setErrors(null); // إزالة الخطأ عند التوافق
      return null;
    }
  }
  
  constructor(private router:Router ,private authService:AuthService){}
  
  
  submitted = false; 
  errorMsg :string =''
  onSubmit() {
    this.submitted=true
    this.signUpPage.updateValueAndValidity(); 

    if (this.signUpPage.invalid) {
      this.signUpPage.markAllAsTouched(); 
      return;
    }
      
    if(this.signUpPage.valid){
      console.log("done");
    this.authService.signup(this.signUpPage.value).subscribe({
      next:(res)=>{
        if(res.token){
          localStorage.setItem('token' ,res.token)
          console.log(res.token);
          console.log(this.signUpPage.value);

          this.router.navigate(["/login"], { replaceUrl: true })
        }else{
          console.log("no token");
        }
      },
      error:(err)=>{
        this.errorMsg= err.error.message || "unexpected error";
      }
    });
    
      
    }else{
      console.log("empty");
    }

    console.log('Form submitted successfully', this.signUpPage.value);
  }
}