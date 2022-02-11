import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private storageSub = new Subject<void>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  getStorageItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  setStorageItem(key: string, data: any): void {
    sessionStorage.setItem(key, data);
    this.storageSub.next();
  }

  removeStorageItem(key: string) {
    sessionStorage.removeItem(key);
    this.storageSub.next();
  }

  clearStorage(): void {
    sessionStorage.clear();
    this.storageSub.next();
  }
}
