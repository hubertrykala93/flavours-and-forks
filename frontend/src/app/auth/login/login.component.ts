import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessages: any = {};
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false)
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const data = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
        remember: this.loginForm.get('remember')?.value
      }

      this.authService.loginUser(data).subscribe({
        next: (response) => {
          this.authService.setToken(response.access_token);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessages = error.error.errors;
          this.setFormErrors()
        }
      })
    }
  }

  setFormErrors(): void {
    for (let controlName in this.errorMessages) {
      if (this.errorMessages.hasOwnProperty(controlName)) {
        const control = this.loginForm.get(controlName);

        if (control) {
          control.setErrors({validationError: this.errorMessages[controlName]});
        } else {
          const currentErrors = this.loginForm.errors ||  {};

          this.loginForm.setErrors({
            ...currentErrors,
            verificationError: this.errorMessages[controlName]
          });
        }
      }
    }
  }
}
