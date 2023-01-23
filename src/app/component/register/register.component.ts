import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model:any={}
  user:any
  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  register(){
    this.authService.register(this.model).subscribe({
      next:res=>this.user=res,
      error:error=>console.log(error)
    });
    if(this.user){
      this.router.navigate(["/login"])
    }else{
      alert("invalid user name or password")
    }
     
  }

}
