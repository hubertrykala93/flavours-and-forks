import { environment } from './../../../environments/environment.dev';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  access_token: string,
  message: string,
  data: {
    username: string,
    remember: boolean
  },
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiRegisterUrl: string = environment.apiUrl + '/api/v1/register';
  private apiLoginUrl: string = environment.apiUrl + '/api/v1/login';
  private apiLogoutUrl: string = environment.apiUrl + '/api/v1/logout';

  constructor(private http: HttpClient) { }

  registerUser(data: { username: string, email: string, password: string}): Observable<any> {
    return this.http.post(this.apiRegisterUrl, data);
  }

  loginUser(data: { username: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiLoginUrl, data).pipe(
      tap(response => {
        const token = response.access_token;

        if (token) {
          this.setToken(token);
        }
      })
    );
  }

  logoutUser(): Observable<any> {
    return this.http.post(this.apiLogoutUrl, {}).pipe(
      tap(() => {
        localStorage.removeItem('access_token');
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
