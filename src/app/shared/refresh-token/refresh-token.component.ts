import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticatedModel } from 'src/app/model/login.model';
import { TokenData } from 'src/app/model/token-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-refresh-token',
  templateUrl: './refresh-token.component.html',
  styleUrls: ['./refresh-token.component.css']
})
export class RefreshTokenComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RefreshTokenComponent>,
    private storageService: StorageService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  refresh(): void {
    let userJson = this.storageService.getStorageItem('user');
    let user!: AuthenticatedModel;
    if (userJson) {
      this.spinnerService.show();
      user = JSON.parse(userJson);
      this.authService.refresh(new TokenData(user.email, '', user.refresh)).subscribe({
        next: (result) => {
          const jwt: JwtHelperService = new JwtHelperService();
          const info = jwt.decodeToken(result.accessToken);
          const loggedIn = new AuthenticatedModel(info.sub, info.role, result.accessToken, result.refreshToken);
          this.storageService.setStorageItem('user', JSON.stringify(loggedIn));
          this.spinnerService.hide();
          this.snackBar.open("Successfully refreshed!", 'Ok', { duration: 2000 });
          this.dialogRef.close('refreshSuccess');
        },
        error: (err) => {
          this.spinnerService.hide();
          this.authService.logOut();
          this.snackBar.open("Something went wrong. Please log in again!", 'Ok', { duration: 2000 });
          this.dialogRef.close('refreshFail');
        }
      })
    } else {
      this.authService.logOut();
      this.snackBar.open("Something went wrong. Please log in again!", 'Ok', { duration: 2000 });
      this.dialogRef.close('refreshFail');
    }
  }

  logOut(): void {
    this.authService.logOut();
    this.dialogRef.close('logout');
  }

}
