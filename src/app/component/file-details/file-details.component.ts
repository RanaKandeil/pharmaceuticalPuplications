import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FileService } from 'src/app/services/file.service';
import { PDFDocumentProxy } from 'ngx-extended-pdf-viewer';
// import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { DatePipe } from '@angular/common';





@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit {
@Input() mobileZoom: boolean = true;
file:any;
user:any;
pdfSrc!: string;
page: number = 1;
subObj:any = "";
pdfLoading: boolean = true;
isModalOpen = false;
totalPages= 0;
datePipe = new DatePipe('en-US');

  constructor(private route:ActivatedRoute,
    private cookieService:CookieService,
     private fileService:FileService,
     private router: Router,
     private dialog: MatDialog,
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

    this.user = JSON.parse(this.cookieService.get('user')!)
    const FileId = this.route.snapshot.paramMap.get('id')
    this.fileService.getFile(FileId).subscribe((res:any)=>{
      this.file = res
      this.pdfLoading = true
      const subArr =this.file.data.subCategories 
      // subArr.forEach((subcat:any) => {
      //   this.subObj += subcat?.SubCategory_name
      // });
      console.log("subArr -",subArr)
      this.subObj = subArr.map((subcat: any) => subcat?.SubCategory_name).join(" ]  [ ");
      this.subObj = " [ " + this.subObj + " ] ";
     
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
  // onPdfLoadComplete(pdf: PDFDocumentProxy): void {
  //   this.pdfLoading = true;
  // }
  onPdfLoadComplete(event: any): void {
    const pdf: PDFDocumentProxy = event.source._pdfInfo;
    this.pdfLoading = false;
    this.totalPages = pdf.numPages;
  }
  delete(id:any){

    this.fileService.deleteFile(id).subscribe((res:any)=>{
      this.router.navigate(['/home'])
    });
  }
}
