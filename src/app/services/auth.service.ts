import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LogInData } from '../model/login.model';
import { RegisterData } from '../model/register.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private baseRoute = environment.gatewayUrl + '/auth-server/api';

  constructor(
    private http: HttpClient, 
    private storageService: StorageService
  ) { }

  logIn(loginData: LogInData): Observable<any> {
    return this.http.post(this.baseRoute + '/auth/log-in',
      loginData, {headers: this.headers, responseType: 'json'});
  }

  register(registrationData: RegisterData): Observable<any> {
    return this.http.post(this.baseRoute + '/auth/register',
      registrationData, {headers: this.headers, responseType: 'json'});
  }

  logOut(): void {
    this.storageService.clearStorage();
  }

  getRole(): string {
    let user = sessionStorage.getItem('user');
    if (!user) {
      return '';
    }
    return JSON.parse(user).role;
  }
}
