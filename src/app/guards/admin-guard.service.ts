import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class AdminGuard implements CanActivate {
  
    constructor(
      public auth: AuthService,
      public router: Router
    ) {
    }
  
    canActivate(): boolean {
      const role = this.auth.getRole();
      if (role !== 'ROLE_ADMIN') {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
  }
  