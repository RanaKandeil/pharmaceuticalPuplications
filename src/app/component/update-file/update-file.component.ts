import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { Subcategories } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';


@Component({
  selector: 'app-update-file',
  templateUrl: './update-file.component.html',
  styleUrls: ['./update-file.component.css']
})
export class UpdateFileComponent implements OnInit {
 countries:any;
 categories:any;
 selectedCategory:any;
 allStatus:any;
 fileForm!:FormGroup;
 subCategoriesArr!:Subcategories[];
 subCatModel!:Subcategories[];
 userId:any;
 fileId:any;
 allFiles:any;
 file:any;
 filePath:any
 subObj:any;
 @ViewChild('fileInput') fileInput!: ElementRef;


  constructor(private categoryService:CategoryService,
     private fileService:FileService, private fb:FormBuilder,
     private route:ActivatedRoute,private router:Router, private toastr:ToastrService) { 
     
     }

  ngOnInit(): void {
 
    const userlogged = JSON.parse(localStorage.getItem('user')!)
    this.userId = userlogged.user_id
    this.fileForm = this.fb.group({
      File_data_id:[''],
      file_name:[''],
      Doc_No:[''],
      Year: [''],
      txt_Ar:[''],
      txt_Eng:[''],
      fileID:[''],
      Country_id:[''],
      Category_id:[''],
      subCategories:[[]],
      createdByID : [this.userId],
      UpdatedbyID: [this.userId],
      status_id:[''],
      file_desc:[''],
      isAuthorized:[''],
      isactive:['']
    })    

    this.categoryService.getCategories().subscribe(res=>{
      this.categories = res;
      //console.log(this.categories)
      
    })

    this.categoryService.getCountries().subscribe(res=>{
      this.countries= res;
    })
    this.fileService.getFileStatus().subscribe(res=>{
      this.allStatus = res;
    })
    this.fileId = this.route.snapshot.paramMap.get('id');
    
    this.fileService.getFile(this.fileId).subscribe(res=>{
      this.file = res;
      console.log(this.file);
      
      this.subCategoriesArr = this.file.data?.subCategories;
   
      const subCategoryIds = this.subCategoriesArr.map(subCategory => subCategory.subcat_id);
      this.fileForm.patchValue({
        file_name:this.file.data?.file_name,
        Year:this.file.data?.Year,
        Doc_No:this.file.data?.Doc_No,
        txt_Ar:this.file.data?.txt_Ar,
        txt_Eng:this.file.data?.txt_Eng,
        Country_id:this.file.data?.Country.id,
        Category_id:this.file.data?.Category.cat_id,
        status_id:this.file.data?.file_data_status.status_id,
        subCategories:subCategoryIds ,
        file_desc:this.file.data?.file_desc,
        isAuthorized:this.file.data?.isAuthorized,
        isactive:this.file.data?.isactive
      },{ emitEvent: true })
    })
  
  }
   
  
  onChange(){
    for(const c of this.categories){
      if(c.cat_id ===this.selectedCategory){
        this.subCategoriesArr = c.subcategories;
        const subCategoryIds = this.subCategoriesArr.map(subCategory => subCategory.subcat_id);
        this.fileForm.patchValue({  subCategories:subCategoryIds })
      }
    }
  }

 
  update(){
    let year = this.fileForm.get('Year')!.value;
    let dateString = new Date(year).getFullYear();
    this.fileForm.get('Year')!.setValue(dateString);

    let subCategories = this.fileForm.get('subCategories')?.value;
    console.log(subCategories)
    let objects = subCategories.map((item:any) => {return {"subcat_id":item}});
    this.fileForm.get('subCategories')?.setValue(JSON.stringify(objects));
  
    const fileInput = this.fileInput?.nativeElement;
    if (fileInput.files && fileInput.files[0]) {
       this.filePath = fileInput.files[0]}

      const formData = new FormData();
      formData.append('file', this.filePath || null);
      formData.append('File_data_id',this.fileId);
      formData.append('file_name', this.fileForm.get('file_name')?.value);
      formData.append('Doc_No', this.fileForm.get('Doc_No')?.value);
      formData.append('Year', this.fileForm.get('Year')?.value);
      formData.append('txt_Ar', this.fileForm.get('txt_Ar')?.value);
      formData.append('txt_Eng', this.fileForm.get('txt_Eng')?.value);
      formData.append('Country_id', this.fileForm.get('Country_id')?.value);
      formData.append('isAuthorized',this.fileForm.get('isAuthorized')?.value);
      formData.append('isactive',this.fileForm.get('isactive')?.value);
      formData.append('Category_id', this.fileForm.get('Category_id')?.value);
      formData.append('subCategories', this.fileForm.get('subCategories')?.value);
      formData.append('status_id',this.fileForm.get('status_id')?.value);
      formData.append('file_desc','');
      formData.append('userID', this.fileForm.get('createdByID')?.value);
      console.log(formData)
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      this.fileService.updateFile(formData).subscribe(result=>{
        this.toastr.success('File updated Successfully!', 'Success');
        this.router.navigate(['/home'])
      },
      error=>{ this.toastr.error('Error In Updating File', 'Error');}
      ) 
}

  cancel(){
    this.router.navigate(['/home'])
  }
}
