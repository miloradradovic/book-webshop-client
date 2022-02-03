import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';

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
    private storageService: StorageService,
    private dialog: MatDialog
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
      name: [null, [Validators.pattern('[A-Z][a-z]+')]],
      surname: [null, [Validators.pattern('[A-Z][a-z]+')]],
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
        this.spinnerService.hide();
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.getCurrentlyLoggedIn();
            } else if (result === 'refreshFail') {
              this.router.navigate(['/']);
            } else if (result === 'logout') {
              this.router.navigate(['/']);
            }
          })
        } else {
          this.snackBar.open(
            'Something went wrong while fetching your data! You might need to log out and log in again!',
            'Ok',
            { duration: 5000 }
          );
        }
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

  fillOutEmptyFields(): void {

    if (!this.form.value.email) {
      this.form.controls['email'].setValue(this.profile.email);
    }

    if (!this.form.value.name) {
      this.form.controls['name'].setValue(this.profile.name);
    }

    if (!this.form.value.surname) {
      this.form.controls['surname'].setValue(this.profile.surname);
    }

    if (!this.form.value.address) {
      this.form.controls['address'].setValue(this.profile.address);
    }

    if (!this.form.value.phoneNumber) {
      this.form.controls['phoneNumber'].setValue(this.profile.phoneNumber);
    }

    if (!this.form.value.password) {
      this.form.controls['password'].setValue('');
    }
  }

  prepareEditProfile(): void {
    this.spinnerService.show();
    this.fillOutEmptyFields()
    if (this.checkFields()) {
      this.editProfile();
    } else {
      this.spinnerService.hide();
      this.snackBar.open("You haven't changed anything!", 'Ok', {
        duration: 3000,
      });
    }
  }

  editProfile(): void {
    this.authService.editUser(new User(this.profile.id, this.form.value.email, this.form.value.password,
      this.form.value.name, this.form.value.surname, this.form.value.phoneNumber, this.form.value.address, this.profile.roles)).subscribe({
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
          if (err.status === 403) {
            const dialogRef = this.dialog.open(RefreshTokenComponent, {});
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'refreshSuccess') {
                this.editProfile();
              } else if (result === 'refreshFail') {
                this.router.navigate(['/']);
              } else if (result === 'logout') {
                this.router.navigate(['/']);
              }
            })
          } else {
            this.snackBar.open(err.error, 'Ok', { duration: 3000 });
            this.getCurrentlyLoggedIn();
          }
        },
      });
  }
}
