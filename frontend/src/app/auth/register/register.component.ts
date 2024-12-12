import { RegisterService } from './../services/register.service';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function confirmPasswordValidator(passwordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get(passwordField)?.value;
    const confirmPassword = control.value;

    return password === confirmPassword || !confirmPassword
      ? null
      : { passwordMismatch: true };
  };
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessages: any = {};
  successMessage: string = '';

  constructor(private registerService: RegisterService) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]),
      repassword: new FormControl('', [Validators.required, confirmPasswordValidator('password')]),
      privacyPolicy: new FormControl(false, [Validators.requiredTrue])
    })
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const data = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        repassword: this.registerForm.get('repassword')?.value,
        privacyPolicy: this.registerForm.get('privacyPolicy')?.value
      }

      this.registerService.registerUser(data).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          window.scrollTo({
            top: 100,
            left: 100,
            behavior: 'smooth'
          })
        },
        error: (error) => {
          this.errorMessages = error.error.errors;
          this.setFormErrors();
        }
      })
    }
  }

  setFormErrors() {
    for (const controlName in this.errorMessages) {
      if (this.errorMessages.hasOwnProperty(controlName)) {
        const control = this.registerForm.get(controlName);

        if (control) {
          control.setErrors({uniqueError: this.errorMessages[controlName]});
        }
      }
    }
  }

}
