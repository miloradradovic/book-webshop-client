import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LogInData } from '../model/login.model';
import { RegisterData } from '../model/register.model';
import { UserForProfile } from '../model/user.model';
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

  getCurrentlyLoggedIn(): Observable<any> {
    return this.http.get(this.baseRoute + '/users/currently-logged-in', {headers: this.headers, responseType: 'json'});
  }

  editProfile(profile: UserForProfile): Observable<any> {
    return this.http.put(this.baseRoute + '/users/edit/' + profile.id, profile, {headers: this.headers, responseType: 'json'});
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.baseRoute + '/users', {headers: this.headers, responseType: 'json'});
  }

  deleteUser(userId: number) {
    return this.http.delete(this.baseRoute + '/users/' + userId, {headers: this.headers, responseType: 'json'});
  }

  logOut(): void {
    this.storageService.clearStorage();
  }

  getRole(): string {
    let user = this.storageService.getStorageItem('user');
    if (!user) {
      return '';
    }
    return JSON.parse(user).role;
  }
}
