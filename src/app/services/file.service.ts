import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchFile } from '../interfaces/searchFile';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http:HttpClient) { }

  createFile(file:any){
    return this.http.post("https://pharmaciax-api.onrender.com/fileData/create",file)
  }

  getAll():Observable<File[]>{
    return this.http.get<File[]>("https://pharmaciax-api.onrender.com/fileData/all")
  }

  searchForFile(searchFile:SearchFile):Observable<File[]>{
    return this.http.post<File[]>("https://pharmaciax-api.onrender.com/fileData/search",searchFile).pipe();
  }
}
