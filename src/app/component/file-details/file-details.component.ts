import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/services/file.service';


@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit {
file:any;
user:any;
pdfSrc!: string;
page: number = 1;
subObj:any = "";
pdfLoading: boolean = true;
  constructor(private route:ActivatedRoute,
     private fileService:FileService,
     private router: Router,
     private sanitizer: DomSanitizer) {
     
    }

    pdfUrl:any; 
  ngOnInit(): void {
    //Test
    // const fileId = '1TSaaV8uhorFOYTs7y9-uZPrGTQbTPOcn';
    // const url = `https://pharmaciax-api.onrender.com/apigoogle/${fileId}`;
    // this.fileService.getFileFromGoogle(url)
    // .subscribe(blob => {
    //   const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    //   this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(pdfBlob));
    //   console.log(this.pdfUrl)
    // });

    this.user = JSON.parse(localStorage.getItem("user")!)
    const FileId = this.route.snapshot.paramMap.get('id')
    this.fileService.getFile(FileId).subscribe((res:any)=>{
      this.file = res
      this.pdfLoading = true
      const subArr =this.file.data.subCategories 
      subArr.forEach((subcat:any) => {
        this.subObj += subcat?.SubCategory_name
      });
     
      const filePath = this.file?.data?.fileID;
   
      const url = `https://pharmaciax-api.onrender.com/apigoogle/${filePath}`;
      this.fileService.getFileFromGoogle(url)
     .subscribe(blob => {
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(pdfBlob));
        console.log(this.pdfUrl)
        this.pdfLoading = false
     }); 
    });
  }
  delete(id:any){
    this.fileService.deleteFile(id).subscribe((res:any)=>{
      this.router.navigate(['/home'])
    });
  }
  
  

}
