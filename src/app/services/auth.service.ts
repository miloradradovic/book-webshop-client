import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient, 
    private storageService: StorageService
  ) { }

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
