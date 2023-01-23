import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
model:any={};
user!: SocialUser;
  loggedIn?: boolean;
  constructor(private authService:AuthService, 
    private router:Router,private googleService: SocialAuthService
    ) { }

  ngOnInit(): void {
    this.googleService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }
  
  login(){
    this.authService.login(this.model).subscribe({
      next:res=>console.log(res),
      error:error=>console.log(error),
    });
    this.router.navigate(["/home"])
  }

  loginWithGoogle(){
    this.googleService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  

}
