import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
userForm!:FormGroup;
val:any;
rolesId:any;
countries:any;
imageUrl:any
  constructor(private route:ActivatedRoute
    ,private categoryService:CategoryService,private fb:FormBuilder,
    private router:Router) { }
  
  ngOnInit(): void {
    this.userForm = this.fb.group({
      id:[""],
      first_name:[""],
      last_name:[""],
      email:[""],
      role_id:[""],
      Country_id:[""]
        })

        this.categoryService.getRoleId().subscribe(res=>{
          this.rolesId = res
        })
        this.categoryService.getCountries().subscribe(res=>{
          this.countries = res
        })

    this.route.data.subscribe(data=>{
      console.log(data)
      const user = data['user'];
      this.userForm.controls['first_name'].setValue(user.first_name)
      this.userForm.controls['last_name'].setValue(user.last_name) 
      this.userForm.controls['email'].setValue(user.email) 
      this.userForm.controls['role_id'].setValue(user.role_name)
      this.userForm.controls['Country_id'].setValue(user.country_name)     
    })
  }
  cancel(){
    this.router.navigate(['/adminPage'])
  }

  onSubmit(){
    // const updatedUser = this.userForm.value
    // this.authService.updateUser(updatedUser).subscribe(res=>{
    //   console.log(res)
      this.router.navigate(['/adminPage'])
    // })
  }
  onImageUpload(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
  }
}
