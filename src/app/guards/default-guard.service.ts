import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router
  ) {
  }

  canActivate(): boolean {
    const role = this.auth.getRole();
    if (role === 'ROLE_USER') {
      this.router.navigate(['/user/handymen-dashboard-browse']);
      return false;
    } else if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/registration-requests']);
      return false;
    }
    return true;
  }
}
