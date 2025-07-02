import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/user';
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private router = inject(Router);
  private isAuthenticated = false;
  private tokenTime: any

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  signup(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<{ message: string, user: any }>(`${this.apiUrl}/signup`, authData).subscribe();
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http.post<{ message: string, token: string, user: any, expiresIn: number }>(`${this.apiUrl}/login`, authData)
      .subscribe((res) => {
          this.token = res.token;

          if (this.token) {
            const expiresInDuration = res.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date(Date.now() + expiresInDuration * 1000)
            this.saveAuthData(this.token, now);
            this.router.navigate(['/']);
          }

      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) return;

    const now = new Date();
    const expiresIn = authInformation.expiresIn.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();

    if (this.tokenTime) {
      clearTimeout(this.tokenTime);
    }
  }

  private setAuthTimer(expiresIn: number) {
    this.tokenTime = setTimeout(() => {
      this.logout();
    }, expiresIn * 1000)
  }

  private saveAuthData(token: string, expiresIn: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
    if (!token || !expiresIn) return;

    return { token, expiresIn: new Date(expiresIn) }
  }
}
