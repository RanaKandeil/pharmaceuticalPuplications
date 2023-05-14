import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private cookieService:CookieService,) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the JWT token from local storage or any other storage mechanism
   
    if (this.cookieService.get('tokenJwt') != null 
    && this.cookieService.get('tokenJwt') != undefined && 
    this.cookieService.get('tokenJwt') != ''){
      const token = JSON.parse(this.cookieService.get('tokenJwt')!);
      
      // Clone the request and add the Authorization header
      if (token) {
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(clonedRequest)
      }
      return next.handle(request);
    }
   else{
    
      return next.handle(request);
    }
  
  }
  
}
