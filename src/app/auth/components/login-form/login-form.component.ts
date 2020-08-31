import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'app/auth/auth.service';
import { validatorPassword } from 'app/shared/form-validators/password.validator';
import { validatorEmail } from 'app/shared/form-validators/email.validator';
import { FormErrors } from 'app/shared/enums/form-errors/form-errors.enum';

@Component({
  selector: 'login-form-cmp',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginFormGroup: FormGroup;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, validatorEmail]),
      password: new FormControl('', [Validators.required, validatorPassword]),
    });
  }

  /**
   * @desc Gets the string of password input error
   * @memberof LoginFormComponent
   */
  getPasswordInputError = (): string => {
    const passwordInput = this.loginFormGroup.get('password');
    if (passwordInput.hasError('required')) {
      return FormErrors.PASSWORD_REQUIRED;
    } else if (passwordInput.hasError('passwordFormat')) {
      return passwordInput.errors.passwordFormat.value;
    } else {
      return '';
    }
  };

  /**
   * @desc Gets the string of email input error
   * @memberof LoginFormComponent
   */
  getEmailInputError = (): string => {
    const emailInput: AbstractControl = this.loginFormGroup.get('email');
    if (emailInput.hasError('required')) {
      return FormErrors.EMAIL_REQUIRED;
    } else if (emailInput.hasError('email')) {
      return emailInput.errors.email.value;
    } else {
      return '';
    }
  };

  /**
   * @desc Checks if form error display is needed
   * @param {('email' | 'password')} controlName
   * @returns {boolean}
   * @memberof LoginFormComponent
   */
  shouldDisplayError = (controlName: 'email' | 'password'): boolean => {
    const formControl: AbstractControl = this.loginFormGroup.get(controlName);
    return formControl.touched && formControl.invalid;
  };

  /**
   * @desc Initiates login process with inputed email and password
   * @memberof LoginFormComponent
   */
  onLogin = (): void => {
    if (this.loginFormGroup.valid) {
      const email = this.loginFormGroup.get('email').value;
      const password = this.loginFormGroup.get('password').value;
      this.auth.setAuthDetails(email, password);
      this.auth.login();
    }
  };
}
