import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl: string = "api/v1/register";

  constructor() { }

  registerUser(data: any): void {

  }
}
