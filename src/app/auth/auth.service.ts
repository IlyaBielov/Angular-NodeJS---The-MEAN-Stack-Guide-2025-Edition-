import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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


  signup(email: string, password: string): Observable<{ message: string, user: any }> {
    const authData: AuthData = { email, password };
    return this.http.post<{ message: string, user: any }>(`${this.apiUrl}/signup`, authData);
  }

  login(email: string, password: string): Observable<{ message: string, token: string, user: any }> {
    const authData: AuthData = { email, password };
    return this.http.post<{ message: string, token: string, user: any }>(`${this.apiUrl}/login`, authData);
  }
}
