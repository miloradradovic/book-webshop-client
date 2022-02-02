import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;
  profile!: User;

  constructor(
    fb: FormBuilder,
    public router: Router,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      email: [null, [Validators.email]],
      password: [
        null,
        [
          Validators.pattern(
            '(?=(.*[0-9]))(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}'
          ),
        ],
      ],
      name: [null, []],
      surname: [null, []],
      address: [null, []],
      phoneNumber: [null, []],
    });
  }

  ngOnInit(): void {
    this.getCurrentlyLoggedIn();
  }

  getCurrentlyLoggedIn(): void {
    this.authService.getCurrentlyLoggedIn().subscribe({
      next: (result) => {
        this.profile = result;
        this.form.controls['email'].setValue(this.profile.email);
        this.form.controls['name'].setValue(this.profile.name);
        this.form.controls['surname'].setValue(this.profile.surname);
        this.form.controls['address'].setValue(this.profile.address);
        this.form.controls['phoneNumber'].setValue(this.profile.phoneNumber);
      },
      error: (err) => {
        this.snackBar.open(
          'Something went wrong while fetching your data! You might need to log out and log in again!',
          'Ok',
          { duration: 5000 }
        );
      },
    });
  }

  checkFields(): boolean {
    if (
      this.form.value.email === this.profile.email &&
      !this.form.value.password &&
      this.form.value.name === this.profile.name &&
      this.form.value.surname === this.profile.surname &&
      this.form.value.address === this.profile.address &&
      this.form.value.phoneNumber === this.profile.phoneNumber
    ) {
      return false;
    }
    return true;
  }

  fillOutEmptyFields(): boolean {
    let emptyEmail: boolean = false;
    let emptyName: boolean = false;
    let emptySurname: boolean = false;
    let emptyAddress: boolean = false;
    let emptyPhoneNumber: boolean = false;

    if (this.form.value.email === '') {
      emptyEmail = true;
      this.form.controls['email'].setValue(this.profile.email);
    } else {
      this.profile.email = this.form.value.email;
    }

    if (this.form.value.name === '') {
      emptyName = true;
      this.form.controls['name'].setValue(this.profile.name);
    } else {
      this.profile.name = this.form.value.name;
    }

    if (this.form.value.surname === '') {
      emptySurname = true;
      this.form.controls['surname'].setValue(this.profile.surname);
    } else {
      this.profile.surname = this.form.value.surname;
    }

    if (this.form.value.address === '') {
      emptyAddress = true;
      this.form.controls['address'].setValue(this.profile.address);
    } else {
      this.profile.address = this.form.value.address;
    }

    if (this.form.value.phoneNumber === '') {
      emptyPhoneNumber = true;
      this.form.controls['phoneNumber'].setValue(this.profile.phoneNumber);
    } else {
      this.profile.phoneNumber = this.form.value.phoneNumber;
    }

    if (this.form.value.password) {
      this.profile.password = this.form.value.password;
    } else {
      this.profile.password = '';
    }

    if (
      emptyEmail &&
      emptyName &&
      emptySurname &&
      emptyAddress &&
      emptyPhoneNumber
    ) {
      return false;
    }
    return true;
  }

  editProfile(): void {
    this.spinnerService.show();
    if (this.checkFields() && this.fillOutEmptyFields()) {
      this.authService.editUser(this.profile).subscribe({
        next: (result) => {
          this.spinnerService.hide();
          this.snackBar.open(
            'Successfully updated. We would like you to log in again!',
            'Ok',
            { duration: 5000 }
          );
          this.authService.logOut();
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.spinnerService.hide();
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
          this.getCurrentlyLoggedIn();
        },
      });
    } else {
      this.spinnerService.hide();
      this.snackBar.open("You haven't changed anything!", 'Ok', {
        duration: 3000,
      });
    }
  }
}
