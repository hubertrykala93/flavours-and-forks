import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function confirmPasswordValidator(passwordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get(passwordField)?.value;
    const confirmPassword = control.value;

    console.log(`Password -> ${password}`);
    console.log(`Confirm Password -> ${confirmPassword}`);

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]),
      repassword: new FormControl('', [Validators.required, confirmPasswordValidator('password')]),
      privacyPolicy: new FormControl(false, [Validators.requiredTrue])
    })
  }

  onSubmit(): void {
    console.log(this.registerForm.get('repassword')?.errors)

    if (this.registerForm.valid) {
      console.log('Form is Valid.')
    } else {
      console.log('Form is not Valid.')
    }
  }

}
