import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Category, Subcategories } from 'src/app/interfaces/category';
import {  SearchFiltre } from 'src/app/interfaces/searchFile';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 user:any;
 countries:any;
 categories: Category[] = [];
 files:any;
 page = 1;
 pageSize = 2;
 totalItems = 0;
 imageUrl:any;
 filesByCountryId:any;
 roles:any;
 loadedData:boolean= false




 
  constructor(private authService:AuthService,
    private router:Router, private loadingService:LoadingService,
    private googleService:SocialAuthService,private fileService:FileService,
    public categoryService:CategoryService) { 
    }

    

  ngOnInit(): void {
     this.user = JSON.parse(localStorage.getItem("user")!)
     
     const userRoleId = this.user.role_id
     this.categoryService.getRoleById(userRoleId).subscribe((res:any)=>{
      this.roles = res
      console.log(this.roles)
     })

     this.loadingService.show()

     this.categoryService.getCountries().subscribe(res=>{
      this.loadingService.hide();
      this.countries = res
     },
     (error) => {
      this.loadingService.setError(error.message);
      this.loadingService.hide();
    })

    this.categoryService.getCategories().subscribe({
      next:(res:any)=>{
        this.loadingService.hide();
          this.categories = res;
          let subCategories = [
            {subcat_id: 1, isActive: true},
            {subcat_id: 2, isActive: false}
          ];
          console.log(JSON.stringify(subCategories))
      },
      error:  (error:any) => {
        this.loadingService.setError(error.message);
        this.loadingService.hide();
      }
    })

    this.showAll();
  }

  logout(){
    this.authService.logout()
    this.googleService.signOut()
    this.router.navigate(["/login"])
  }

  getDataForPage() {
    if (this.files) {
      const startIndex = (this.page - 1) * this.pageSize;
      return this.files.slice(startIndex, startIndex + this.pageSize);
    }
    return [];
  }
 

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages() {
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    return Array(end - start + 1).fill(0).map((_, i) => start + i);
  }

  
   goToPage(page: number) {
     if (page >= 1 && page <= this.totalPages) {
       this.page = page;
     }
  }


  filterDataByCat(category:Category){
    const searchFilter: SearchFiltre = {
      category_id: category.cat_id,
      country_id: this.user?.Country_id,
      subcat_id:null,
    };
    
    this.searchForFiles(searchFilter);
  }

  filterDataBySub(category:any,subCategories:any){
    const searchObj:SearchFiltre = {
      subcat_id:subCategories.subcat_id,
      category_id: category.cat_id,
      country_id :this.user?.Country_id
    };
    this.searchForFiles(searchObj)
  }
  
  filterDataByCountry(countryId:any){
    const searchObj:SearchFiltre ={
      country_id:countryId,
      subcat_id:null,
      category_id: null,
    };
    this.searchForFiles(searchObj)
  }

  searchForFiles(searchFilter:SearchFiltre){
    this.loadingService.show();
    this.fileService.searchForFile(searchFilter).subscribe(result=>{
      this.loadingService.hide();
      this.files = result;
      this.loadedData= true
     
      this.totalItems = this.files.length;
      this.getDataForPage()
      this.goToPage(1);
      
    },
    (error) => {
      this.loadingService.setError(error.message);
      this.loadingService.hide();
    }
    )
  }
  showAll(){
     this.fileService.getAll().subscribe({
       next:res=>{
        console.log(res)
          this.files= res;
          console.log(this.files)
        this.totalItems = this.files.length;
      },
      error:error=>console.log(error)
     })
  }
}
