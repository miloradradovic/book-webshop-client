import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router
  ) {
  }

  canActivate(): boolean {
    const role = this.auth.getRole();
    if (role !== 'ROLE_USER') {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
