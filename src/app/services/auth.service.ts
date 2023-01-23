import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private currentUserSource = new BehaviorSubject(null);
currentUser$= this.currentUserSource.asObservable()
  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post("http://localhost:5104/api/account/login",model)
    .pipe(map((res:any)=>{
      const user = res;
      if(user){
        localStorage.setItem("user",JSON.stringify(user));
        this.currentUserSource.next(user)
      }
    })
  )};

  register(model:any){
    return this.http.post("http://localhost:5104/api/account/register",model)
  }

  logout(){
    localStorage.removeItem("user");
    this.currentUserSource.next(null)
  }

  setCurrentUser(user:any){
    this.currentUserSource.next(user)
  }
}
