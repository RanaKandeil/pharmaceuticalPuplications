import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pharmaceuticalPuplications';

  constructor(private authService:AuthService,private router:Router){

  }
  ngOnInit(): void {
    this.setCurrentUser()
    const user = localStorage.getItem('user')
   // console.log(user)
  }
  setCurrentUser(){
    const userString = localStorage.getItem("user")
    if(!userString) return
        
      const user = JSON.parse(userString)
    this.authService.setCurrentUser(user)
    }    
  }

