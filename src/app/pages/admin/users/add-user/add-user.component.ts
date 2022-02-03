import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegisterData } from 'src/app/model/register.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;
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
    public dialogRef: MatDialogRef<AddUserComponent>,
    private dialog: MatDialog
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=(.*[0-9]))(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}'
          ),
        ],
      ],
      name: [null, [Validators.required, Validators.pattern('[A-Z][a-z]+')]],
      surname: [null, [Validators.required, Validators.pattern('[A-Z][a-z]+')]],
      address: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      selectedRole: [null, [Validators.required]],
    });
  }

  ngOnInit(): void { }

  add(): void {
    this.spinnerService.show();
    const registrationData: RegisterData = new RegisterData(
      this.form.value.email,
      this.form.value.password,
      this.form.value.name,
      this.form.value.surname,
      this.form.value.address,
      this.form.value.phoneNumber,
      this.form.value.selectedRole
    );
    this.authService.register(registrationData).subscribe({
      next: (result) => {
        this.spinnerService.hide();
        this.snackBar.open('User was successfully added!', 'Ok', {
          duration: 5000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.spinnerService.hide();
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.add();
            } else if (result === 'refreshFail') {
              this.router.navigate(['/']);
            } else if (result === 'logout') {
              this.router.navigate(['/']);
            }
          })
        } else {
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
        }
      },
    });
  }
}
