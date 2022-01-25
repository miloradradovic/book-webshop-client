import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  role: string = '';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.storageService.watchStorage().subscribe(() => {
      let userString = sessionStorage.getItem('user');
      let user;
      if (!userString) {
        this.role = '';
      } else {
        user = JSON.parse(userString);
        this.role = user.role;
      }
    });

    let userString = sessionStorage.getItem('user');
      let user;
      if (!userString) {
        this.role = '';
      } else {
        user = JSON.parse(userString);
        this.role = user.role;
      }
  }

  logOut($event: any): void {
    this.authService.logOut();
  }

}
