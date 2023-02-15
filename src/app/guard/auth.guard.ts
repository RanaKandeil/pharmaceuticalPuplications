import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,
    private toastr:ToastrService) {}
  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user: any) => {
        if (user) {
          return true;
        } else {
          console.log("alooooooooooooo")
          this.toastr.error('YOU SHOULD LOGIN FIRST')
          this.router.navigate(['login']);
          return false;
        }
      })
    );
  }
}
