import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticatedModel } from 'src/app/model/login.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.css'],
})
export class UsersDashboardComponent implements OnInit {
  dataSource = new MatTableDataSource();
  users: User[] = [];
  columnsToDisplay: string[] = [
    'Email',
    'Name',
    'Surname',
    'Phone number',
    'Address',
    'Role',
    'Edit',
    'Delete',
  ];
  columnsToIterate: string[] = [
    'email',
    'name',
    'surname',
    'phoneNumber',
    'address',
    'rolesTable',
  ];

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    let currentUserJSON = this.storageService.getStorageItem('user');
    let currentUser!: AuthenticatedModel;
    if (currentUserJSON) {
      currentUser = JSON.parse(currentUserJSON);
    }
    let indexToDelete = -1;
    this.authService.getAllUsers().subscribe({
      next: (result) => {
        this.users = result;
        this.users.forEach((user, index) => {
          if (user.email === currentUser.email) {
            indexToDelete = index;
          }
          let role = '';
          user.roles.forEach((element, index) => {
            if (index === user.roles.length - 1) {
              role = role + element.split('_')[1];
            } else {
              role = role + element.split('_')[1] + ', ';
            }
          });
          user.rolesTable = role;
        });
        this.users.splice(indexToDelete, 1);
        this.dataSource.data = this.users;
      },
      error: (err) => {
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.getAllUsers();
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

  delete(userId: number) {
    this.authService.deleteUser(userId).subscribe({
      next: (result) => {
        this.snackBar.open('User successfully deleted!', 'Ok', {
          duration: 2000,
        });
        this.getAllUsers();
      },
      error: (err) => {
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.delete(userId);
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

  edit(userId: number) {
    let user!: User;

    this.users.forEach((element) => {
      if (element.id === userId) {
        user = element;
      }
    });

    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '30%',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers();
      }
    });
  }

  add(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers();
      }
    });
  }
}
