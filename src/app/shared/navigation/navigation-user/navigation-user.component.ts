import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-user',
  templateUrl: './navigation-user.component.html',
  styleUrls: ['./navigation-user.component.css']
})
export class NavigationUserComponent implements OnInit {

  @Output() logOut = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  logOutUser(): void {
    this.logOut.emit();
  }

}
