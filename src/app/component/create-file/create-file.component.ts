import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, Subcategories } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-file',
  templateUrl: './create-file.component.html',
  styleUrls: ['./create-file.component.css']
})
export class CreateFileComponent implements OnInit {
  userId!:number
  fileForm!:FormGroup
  categories!:Category[];
  countries:any;
  selectedCategory:any;
  subCategoriesArr!:Subcategories[];
  allStatus:any;
  filePath:any;
  constructor(private fb:FormBuilder,private fileService:FileService,
     private categoryService:CategoryService,private toastr: ToastrService,
     private router:Router) {}
     
      

  ngOnInit(): void {
    const userlogged = JSON.parse(localStorage.getItem('user')!)
    this.userId = userlogged.user_id
    this.fileForm = this.fb.group({
      file_name:[''],
      Doc_No:[''],
      Year: [''],
      txt_Ar:[''],
      txt_Eng:[''],
      Country_id:[''],
      Category_id:[''],
      subCategories:[[]],
      createdByID : [this.userId],
      UpdatedbyID: [this.userId],
      status_id:[''],
      file_desc:[''],
      isAuthorized:[false],
    });
    // this.fileForm.get('isactive')?.valueChanges.subscribe((value) => {
    //   const newValue = value === false ? 0 : 1;
    //   this.fileForm.get('isactive')?.patchValue(newValue, { emitEvent: false });
    // });    
    
    this.categoryService.getCategories().subscribe((res:any)=>{
      this.categories = res
    })
    this.categoryService.getCountries().subscribe((res:any)=>{
      this.countries= res
    })
    this.fileService.getFileStatus().subscribe((res:any)=>{
      this.allStatus=res
    })
  }
  // createFile(){
  //   let year = this.fileForm.get('Year')!.value;
  //   let dateString = new Date(year).getFullYear().toString();
  //   this.fileForm.get('Year')!.setValue(dateString);

  //   let subCategories = this.fileForm.get('subCategories')?.value;
  //   let objects = subCategories.map((item:any) => {return {"subcat_id":item}});
  //   this.fileForm.get('subCategories')?.setValue(objects)

    
  //   let formValue: Record<string, any> = {};
  //   Object.keys(this.fileForm.controls).forEach(key => {
  //     formValue[`${key}`] = this.fileForm.get(key)?.value;});
  //   console.log(formValue)


  //   this.fileService.createFile(formValue).subscribe(res=>{
  //     this.toastr.success('File Added Successfully!', 'Success');
      
  //       },
  //   error=>{ this.toastr.error('Error In Creating File', 'Error');}
  //   )
  // }

  cancel(){
    this.router.navigate(['/home'])
  }

  onChange(){
    for(const c of this.categories){
      if(c.cat_id ===this.selectedCategory){
        this.subCategoriesArr = c.subcategories;
      }
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef;
  onFileUpload() {
    let subCategories = this.fileForm.get('subCategories')?.value;
    let objects = subCategories.map((item:any) => {return {"subcat_id":item}});
    this.fileForm.get('subCategories')?.setValue(JSON.stringify(objects))

    let year = this.fileForm.get('Year')!.value;
    let dateString = new Date(year).getFullYear();
    this.fileForm.get('Year')!.setValue(dateString);

    const fileInput = this.fileInput?.nativeElement;
    if (fileInput.files && fileInput.files[0]) {
       this.filePath = fileInput.files[0]};
      const formData = new FormData();
      formData.append('file', this.filePath);
      formData.append('file_name', this.fileForm.get('file_name')?.value);
      formData.append('Doc_No', this.fileForm.get('Doc_No')?.value);
      formData.append('Year', this.fileForm.get('Year')?.value);
      formData.append('txt_Ar', this.fileForm.get('txt_Ar')?.value);
      formData.append('txt_Eng', this.fileForm.get('txt_Eng')?.value);
      formData.append('Country_id', this.fileForm.get('Country_id')?.value);
      formData.append('isAuthorized',this.fileForm.get('isAuthorized')?.value);
      formData.append('Category_id', this.fileForm.get('Category_id')?.value);
      formData.append('subCategories', this.fileForm.get('subCategories')?.value);
      formData.append('status_id',this.fileForm.get('status_id')?.value);
      formData.append('file_desc','');
      formData.append('userID', this.fileForm.get('createdByID')?.value);
      
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
    this.fileService.createFile(formData).subscribe(result=>{
      this.toastr.success('File Added Successfully!', 'Success');
      this.router.navigate(['/home'])
    },
    error=>{ this.toastr.error('Error In Creating File', 'Error');}
    )
  }
}
