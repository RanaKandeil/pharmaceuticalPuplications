import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }
  categories:any;
  countries:any;
 
  getCategories():Observable<any>{
    return this.http.get("https://pharmaciax-api.onrender.com/CategoryList").pipe();
  }

  getCountries():Observable<any>{
    return this.http.get("https://pharmaciax-api.onrender.com/countries").pipe();
  }
  getRoleId(){
    return this.http.get("https://pharmaciax-api.onrender.com/roles").pipe();
  }

  getRoleById(id:any){
    return this.http.get('https://pharmaciax-api.onrender.com/role' +'/' + id).pipe();
  }
}


