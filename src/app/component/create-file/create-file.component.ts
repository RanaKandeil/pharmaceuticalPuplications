import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  selectedSubcategory:string="";
  subCategoriesArr!:Subcategories[];
  // @Output() change: EventEmitter<any> = new EventEmitter();

  constructor(private fb:FormBuilder,private fileService:FileService,
     private categoryService:CategoryService,private toastr: ToastrService,
     private router:Router) { }

  ngOnInit(): void {
    const userlogged = JSON.parse(localStorage.getItem('user')!)
    this.userId = userlogged.user_id
    this.fileForm = this.fb.group({
      file_name:[''],
       Doc_No:['123'],
      Year: [''],
      txt_Ar:[''],
      txt_Eng:[''],
      file_Path:[''],
      Country_id:[''],
      Category_id:[''],
      subCategories:[[]],
      createdByID : [this.userId],
      UpdatedbyID: [this.userId],
    })    
    
    this.categoryService.getCategories().subscribe(res=>{
      this.categories = res
    })
    this.categoryService.getCountries().subscribe(res=>{
      this.countries= res
    })
  }
  createFile(){
    let year = this.fileForm.get('Year')!.value;
    let dateString = new Date(year).getFullYear().toString();
    this.fileForm.get('Year')!.setValue(dateString);

    let subCategories = this.fileForm.get('subCategories')?.value;
    let objects = subCategories.map((item:any) => {return {"subcat_id":item}});
    this.fileForm.get('subCategories')?.setValue(objects)

    let formValue: Record<string, any> = {};
    Object.keys(this.fileForm.controls).forEach(key => {
      formValue[`${key}`] = this.fileForm.get(key)?.value;});
    console.log(formValue)
    this.fileService.createFile(formValue).subscribe(res=>{
      this.toastr.success('File Added Successfully!', 'Success');
      
        },
    error=>{ this.toastr.error('Error In Creating File', 'Error');}
    )
  }

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
}
