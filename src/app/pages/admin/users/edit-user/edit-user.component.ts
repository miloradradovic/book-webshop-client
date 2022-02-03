import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';

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
    @Inject(MAT_DIALOG_DATA) public data: User,
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
      this.form.value.phoneNumber === this.user.phoneNumber &&
      this.form.value.selectedRole === this.user.roles[1]
    ) {
      return false;
    }
    return true;
  }

  fillOutEmptyFields(): void {

    if (!this.form.value.email) {
      this.form.controls['email'].setValue(this.user.email);
    }

    if (!this.form.value.name) {
      this.form.controls['name'].setValue(this.user.name);
    }

    if (!this.form.value.surname) {
      this.form.controls['surname'].setValue(this.user.surname);
    }

    if (!this.form.value.address) {
      this.form.controls['address'].setValue(this.user.address);
    }

    if (!this.form.value.phoneNumber) {
      this.form.controls['phoneNumber'].setValue(this.user.phoneNumber);
    }

    if (!this.form.value.password) {
      this.form.controls['password'].setValue('');
    }

    if (!this.form.value.selectedRole) {
      this.form.controls['selectedRole'].setValue(this.user.roles[0]);
    }
  }

  prepareEdit(): void {
    this.spinnerService.show();
    this.fillOutEmptyFields();
    if (this.checkFields()) {
      this.edit();
    } else {
      this.spinnerService.hide();
      this.snackBar.open("You haven't changed anything!", 'Ok', {
        duration: 3000,
      });
    }
  }

  edit(): void {
    let roles = [];
    roles.push(this.form.value.selectedRole);
    this.authService.editUser(new User(this.user.id, this.form.value.email, this.form.value.password, this.form.value.name,
      this.form.value.surname, this.form.value.phoneNumber, this.form.value.address, roles)).subscribe({
        next: (result) => {
          this.spinnerService.hide();
          this.snackBar.open('Successfully updated.', 'Ok', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.spinnerService.hide();
          if (err.status === 403) {
            const dialogRef = this.dialog.open(RefreshTokenComponent, {});
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'refreshSuccess') {
                this.edit();
              } else if (result === 'refreshFail') {
                this.router.navigate(['/']);
              } else if (result === 'logout') {
                this.router.navigate(['/']);
              }
            })
          } else {
            this.snackBar.open(err.error, 'Ok', { duration: 3000 });
            this.initializeFields();
          }
        },
      });
  }
}
