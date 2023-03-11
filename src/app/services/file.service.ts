import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {  SearchFiltre } from '../interfaces/searchFile';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http:HttpClient) { }

  // createFile(file:any){
  //   return this.http.post("https://pharmaciax-api.onrender.com/fileData/create",file)
  // }

  createOrUpdateFile(fileForm:any,fileInput:any, url:any){
    let subCategories = fileForm.get('subCategories')?.value;
    let objects = subCategories.map((item:any) => {return {"subcat_id":item}});
    fileForm.get('subCategories')?.setValue(JSON.stringify(objects))

    let year = fileForm.get('Year')!.value;
    let dateString = new Date(year).getFullYear();
    fileForm.get('Year')!.setValue(dateString);

    const fileInputconst = fileInput?.nativeElement;
    if (fileInputconst.files && fileInputconst.files[0]) {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_name', fileForm.get('file_name')?.value);
      formData.append('Doc_No', fileForm.get('Doc_No')?.value);
      formData.append('Year', fileForm.get('Year')?.value);
      formData.append('txt_Ar', fileForm.get('txt_Ar')?.value);
      formData.append('txt_Eng', fileForm.get('txt_Eng')?.value);
      formData.append('Country_id', fileForm.get('Country_id')?.value);
      formData.append('isAuthorized','0')
      formData.append('Category_id', fileForm.get('Category_id')?.value);
      formData.append('subCategories', fileForm.get('subCategories')?.value);
      formData.append('status_id',fileForm.get('status_id')?.value);
      formData.append('file_desc','');
      formData.append('userID', fileForm.get('createdByID')?.value);
   ;
      
      
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      this.createFile(formData).pipe();
  }
}
   createFile(formData:any){
    
    let headers = new HttpHeaders();
    let boundary = Math.random().toString().substr(2);
      headers.append('Content-Type', `multipart/form-data; boundary=${boundary}`);
    return  this.http.post('https://pharmaciax-api.onrender.com/fileData/create',
     formData, { headers: headers }).pipe();
    
  }
  getAll():Observable<any>{
    return this.http.get("https://pharmaciax-api.onrender.com/fileData/all").pipe();
  }
 
  getFile(id:any):Observable<any>{
    return this.http.get('https://pharmaciax-api.onrender.com/fileData/GetOne' + '/' + id)
  }
getFileFromGoogle(url:any){
  //const headers = new HttpHeaders().set('X-Api-Key', 'AIzaSyB9ZdM_rTSbc7W5mafzDA8Maw7BuDr_Kfs');
 return this.http.get(url,  { responseType: 'blob' })
  .pipe();
}
  
  deleteFile(id:any){
    return this.http.delete('https://pharmaciax-api.onrender.com/fileData/DeleteOne'+'/'+id).pipe();
  }
 
  searchForFile(searchFile:SearchFiltre):Observable<File[]>{
    return this.http.post<File[]>("https://pharmaciax-api.onrender.com/fileData/search",searchFile).pipe();
  }

  getFileStatus(){
    return this.http.get("https://pharmaciax-api.onrender.com/File-status-List").pipe();
  }

  updateFile(file:any){
    return this.http.put("https://pharmaciax-api.onrender.com/fileData/update", file).pipe(map(()=>file));
  }
}
