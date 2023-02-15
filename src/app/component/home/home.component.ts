import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Category } from 'src/app/interfaces/category';
import { SearchFile } from 'src/app/interfaces/searchFile';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 user:any;
 categories: Category[] = [];
 files:any;
 page = 1;
 pageSize = 2;
 totalItems = 0;
 imageUrl:any;
 filteredArr: any[] = [];



 
  constructor(private authService:AuthService,
    private router:Router,
    private googleService:SocialAuthService,private fileService:FileService,
    public categoryService:CategoryService) { 
    }

    

  ngOnInit(): void {
     this.user = JSON.parse(localStorage.getItem("user")!)

    this.categoryService.getCategories().subscribe({
      next:res=>{
          this.categories = res;
      },
      error:error=>console.log(error)
    })

    
     this.fileService.getAll().subscribe({
       next:res=>{
          this.files= res;
          console.log(this.files)
          this.filteredArr = this.files
        this.totalItems = this.files.length;
      },
      error:error=>console.log(error)
     })
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

  openModal(url: string) {
    this.imageUrl = url;
    this.modal.open();
    console.log(this.imageUrl)
  }
  @ViewChild(ModalComponent) modal!: ModalComponent;

  filterData(category:Category){
    const searchFilter: SearchFile = {
      category_id: category.cat_id,
    };
    
    this.fileService.searchForFile(searchFilter).subscribe(result=>{
      console.log(result)
      this.files = result;
      this.totalItems = this.files.length;
      this.getDataForPage()
      this.goToPage(1)
    })

  }
}
