import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private tokenKey = 'token';

  getToken(): any {
    // @ts-ignore
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: any): void {
      localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
