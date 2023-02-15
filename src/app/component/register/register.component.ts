import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  model: any = {
    id_token: null,
  };
  user: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  showSuccess() {
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  }
  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Record Saved',
    });
  }

  register() {
    console.log(this.model);
    this.authService.register(this.model).subscribe({
      next: (res) => {
        this.user = res;
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Success',
          detail: 'Message Content',
        });

        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: error.status,
          detail: error.error.message,
        });
      },
    });
  }
}
