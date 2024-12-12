import { environment } from './../../../environments/environment.dev';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl: string = environment.apiUrl + '/api/v1/register';

  constructor(private http: HttpClient) { }

  registerUser(data: { username: string, email: string, password: string}): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
