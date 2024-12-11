import { Injectable } from '@angular/core';

export type User = {
  username: string,
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: User[] = []

  constructor() { }

  registerUser(newUser: User): void {
    console.log(newUser);
  }
}
