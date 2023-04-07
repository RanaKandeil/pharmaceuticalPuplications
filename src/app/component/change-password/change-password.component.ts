import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
model:any={};
userIdLocal:any;
userApi:any
  constructor( private authService:AuthService,private loadingService:LoadingService,

    private toastr:ToastrService, private router:Router) { }

  ngOnInit(): void {
this.userIdLocal = JSON.parse( localStorage.getItem('user')!).user_id
this.authService.getUser(this.userIdLocal).subscribe(res=>{
  this.userApi= res
  this.model.email= this.userApi.email
  console.log(this.model.email)
})
  }
async changePassword(){
  this.loadingService.show();
  this.model.oldPassword = await CryptoJS.AES.encrypt(this.model.oldPassword, 'postgress').toString()
  this.model.newPassword = await CryptoJS.AES.encrypt(this.model.newPassword, 'postgress').toString()
  this.model.confirmNewPassword = await CryptoJS.AES.encrypt(this.model.confirmNewPassword, 'postgress').toString()  
  this.authService.updatePassword(this.model).subscribe(
     (response) => {
       this.loadingService.hide();
       this.toastr.success('password updated Successfully!', 'Success');
       this.logout()
       this.router.navigate(['/login'])
     },
     (error) => {
       this.toastr.error('Error In Updating password', 'Error')
     }
   );
}
logout(){
  this.authService.logout()
}
}
