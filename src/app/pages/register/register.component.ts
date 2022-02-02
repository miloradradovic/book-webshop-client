import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegisterData } from 'src/app/model/register.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  private fb: FormBuilder;

  constructor(
    fb: FormBuilder,
    public router: Router,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern('(?=(.*[0-9]))(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}')]],
      name: [null, [Validators.required, Validators.pattern('[A-Z][a-z]+')]],
      surname: [null, [Validators.required, Validators.pattern('[A-Z][a-z]+')]],
      address: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  register(): void {
    this.spinnerService.show();
    const registrationData: RegisterData = new RegisterData(
      this.form.value.email,
      this.form.value.password,
      this.form.value.name,
      this.form.value.surname,
      this.form.value.address,
      this.form.value.phoneNumber,
      'ROLE_USER');
    this.authService.register(registrationData).subscribe({
      next: (result) => {
        this.spinnerService.hide();
        this.snackBar.open("Registration was successful! Now you can log in!", 'Ok', {duration: 5000});
        this.router.navigate(['/']);
      }, 
      error: (err) => {
        this.spinnerService.hide();
        this.snackBar.open(err.error, 'Ok', {duration: 3000});
      }
    });
  }
}
