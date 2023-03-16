import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDetailsComponent } from '../component/user-details/user-details.component';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private currentUserSource = new BehaviorSubject(null);
currentUser$= this.currentUserSource.asObservable()
  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get('https://pharmaciax-api.onrender.com/users')
  }
  getUser(id:any):Observable<any>{
    return this.http.get(`${environment.base_url}`+"user" + "/" + id)
  }

  createuser(user:any){
    return this.http.post(`${environment.base_url}`+"user/create",user)

  }
  updateUser(user:any):Observable<any>{
    return this.http.put(`${environment.base_url}`+"user/update" ,user).pipe(map(()=>user))
  }

  updatePassword(model:any) {
   
    return this.http.put(`${environment.base_url}`+'user/change-password', model);
  }
  

  login(model:any){
    return this.http.post(`${environment.base_url}`+"user/login",model)
    .pipe(map((res:any)=>{
      const user = res;
      if(user){
        localStorage.setItem("user",JSON.stringify(user));
        console.log(localStorage.getItem("user"))
        this.currentUserSource.next(user)
      }
      return user
    })
  )};

  register(model:any){
    return this.http.post(`${environment.base_url}`+'user/create',model)
  }

  logout(){
    localStorage.removeItem("user");
    this.currentUserSource.next(null)
  }

  setCurrentUser(user:any){
    this.currentUserSource.next(user)
  }
}
