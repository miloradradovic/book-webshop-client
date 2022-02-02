import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;
  user!: User;
  roles: any[] = [
    { fullName: 'ROLE_USER', name: 'USER' },
    { fullName: 'ROLE_ADMIN', name: 'ADMIN' },
  ];

  constructor(
    fb: FormBuilder,
    public router: Router,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
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
      selectedRole: [null, []],
    });
  }

  ngOnInit(): void {
    this.initializeFields();
  }

  initializeFields(): void {
    this.user = this.data;
    this.form.controls['email'].setValue(this.user.email);
    this.form.controls['name'].setValue(this.user.name);
    this.form.controls['surname'].setValue(this.user.surname);
    this.form.controls['address'].setValue(this.user.address);
    this.form.controls['phoneNumber'].setValue(this.user.phoneNumber);
    this.form.controls['selectedRole'].setValue(this.user.roles[0]);
  }

  checkFields(): boolean {
    if (
      this.form.value.email === this.user.email &&
      !this.form.value.password &&
      this.form.value.name === this.user.name &&
      this.form.value.surname === this.user.surname &&
      this.form.value.address === this.user.address &&
      this.form.value.phoneNumber === this.user.phoneNumber
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
      this.form.controls['email'].setValue(this.user.email);
    } else {
      this.user.email = this.form.value.email;
    }

    if (this.form.value.name === '') {
      emptyName = true;
      this.form.controls['name'].setValue(this.user.name);
    } else {
      this.user.name = this.form.value.name;
    }

    if (this.form.value.surname === '') {
      emptySurname = true;
      this.form.controls['surname'].setValue(this.user.surname);
    } else {
      this.user.surname = this.form.value.surname;
    }

    if (this.form.value.address === '') {
      emptyAddress = true;
      this.form.controls['address'].setValue(this.user.address);
    } else {
      this.user.address = this.form.value.address;
    }

    if (this.form.value.phoneNumber === '') {
      emptyPhoneNumber = true;
      this.form.controls['phoneNumber'].setValue(this.user.phoneNumber);
    } else {
      this.user.phoneNumber = this.form.value.phoneNumber;
    }

    if (this.form.value.password) {
      this.user.password = this.form.value.password;
    } else {
      this.user.password = '';
    }

    this.user.roles = [];
    this.user.roles.push(this.form.value.selectedRole);

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

  edit(): void {
    this.spinnerService.show();
    if (this.checkFields() && this.fillOutEmptyFields()) {
      this.authService.editUser(this.user).subscribe({
        next: (result) => {
          this.spinnerService.hide();
          this.snackBar.open('Successfully updated.', 'Ok', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.spinnerService.hide();
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
          this.initializeFields();
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
