import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.css']
})
export class UsersDashboardComponent implements OnInit {

  dataSource = new MatTableDataSource();
  users: User[] = [];
  columnsToDisplay: string[] = ['Email', 'Name', 'Surname', 'Phone number', 'Address', 'Role', 'Edit', 'Delete'];
  columnsToIterate: string[] = ['email', 'name', 'surname', 'phoneNumber', 'address', 'rolesTable'];

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (result) => {
        this.users = result;
        this.users.forEach(user => {
          let role = '';
          user.roles.forEach((element, index) => {
            if (index === user.roles.length - 1) {
              role = role + element.split('_')[1];
            } else {
              role = role + element.split('_')[1] + ', ';
            }
          })
          user.rolesTable = role;
        })
        this.dataSource.data = this.users;
      }, 
      error: (err) => {
        this.snackBar.open(err.error, 'Ok', {duration: 2000});
      }
    })
  }

  delete(userId: number) {
    this.authService.deleteUser(userId).subscribe({
      next: (result) => {
        this.snackBar.open('User successfully deleted!', 'Ok', {duration: 2000});
        this.getAllUsers();
      },
      error: (err) => {
        this.snackBar.open(err.error, 'Ok', {duration: 2000});
      }
    })
  }

}
