import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticatedModel, LogInData } from 'src/app/model/login.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  data: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private storageService: StorageService,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  submit(): void {
    const logIn: LogInData = this.form.value;
    this.spinnerService.show();
    this.authService.logIn(logIn).subscribe({
      next: (result) => { 
        const jwt: JwtHelperService = new JwtHelperService();
        const info = jwt.decodeToken(result.accessToken);
        const loggedIn = new AuthenticatedModel(info.sub, info.role, result.accessToken);
        this.storageService.setStorageItem('user', JSON.stringify(loggedIn));
        this.spinnerService.hide();
        this.snackBar.open("Successfully logged in!", 'Ok', {duration: 2000});
        if (info.role === 'ROLE_USER') {
         this.router.navigate(['user/catalog-dashboard']);
        } else {
          this.router.navigate(['/admin/orders-dashboard'])
        }
      },
      error: (err) => {
        this.spinnerService.hide();
        this.snackBar.open(err.error, 'Ok', {duration: 2000});
      }
      
    });
  }

  createAccount(): void {
    this.router.navigate(['/register']);
  }

}
