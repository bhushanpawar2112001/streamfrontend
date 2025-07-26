import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Backend API URL
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Helper to check if running in browser
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(email: string, password: string): Observable<any> {
    console.log('AuthService.login called with:', email);
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        console.log('Login response received:', res);
        console.log('Response has access_token:', !!res.access_token);
        console.log('Response has user:', !!res.user);
        console.log('isPlatformBrowser:', isPlatformBrowser(this.platformId));
        
        if (res.access_token && AuthService.isBrowser()) {
          console.log('Storing token in localStorage:', res.access_token);
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('user', JSON.stringify(res.user));
          console.log('Token stored. Verification - token exists:', !!localStorage.getItem('token'));
        } else {
          console.log('NOT storing token. Reasons:');
          console.log('- No access_token:', !res.access_token);
          console.log('- Not browser platform:', !isPlatformBrowser(this.platformId));
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    if (AuthService.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  isLoggedIn(): boolean {
    if (AuthService.isBrowser()) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (AuthService.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUser(): any {
    if (AuthService.isBrowser()) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}
