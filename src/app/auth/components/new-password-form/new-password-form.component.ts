import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { AuthService } from 'app/auth/auth.service';
import { validatorPassword } from 'app/shared/form-validators/password.validator';
import { passwordMatchValidator } from 'app/shared/form-validators/passwod-match.validator';
import { FormErrors } from 'app/shared/enums/form-errors/form-errors.enum';

@Component({
  selector: 'new-password-form-cmp',
  templateUrl: './new-password-form.component.html',
  styleUrls: ['./new-password-form.component.scss'],
})
export class NewPasswordFormComponent implements OnInit {
  newPasswordFormGroup: FormGroup;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.newPasswordFormGroup = new FormGroup(
      {
        newPassword: new FormControl('', [Validators.required, validatorPassword]),
        confirmPassword: new FormControl('', [Validators.required, validatorPassword]),
      },
      { validators: [passwordMatchValidator] }
    );
  }

  /**
   * @desc Gets the string of form input error
   * @memberof NewPasswordFormComponent
   */
  getFormInputError = (field: 'newPassword' | 'confirmPassword'): string => {
    const passwordInput = this.newPasswordFormGroup.get(field);

    if (passwordInput.hasError('required')) {
      return field === 'newPassword' ? FormErrors.NEW_PASSWORD_REQUIRED : FormErrors.CONFIRM_PASSWORD_REQUIRED;
    } else if (passwordInput.hasError('passwordFormat')) {
      return passwordInput.errors.passwordFormat.value;
    } else if (this.shouldDisplayPasswordMatchError()) {
      return passwordInput.errors.passwordMatch.value;
    } else {
      return '';
    }
  };

  /**
   * @desc Checks if password match error display is needed
   * @returns {boolean}
   * @memberof NewPasswordFormComponent
   */
  shouldDisplayPasswordMatchError = (): boolean => {
    return (
      this.newPasswordFormGroup.get('confirmPassword').hasError('passwordMatch') &&
      !this.newPasswordFormGroup.get('newPassword').hasError('required')
    );
  };

  /**
   * @desc Checks if form error display is needed
   * @param {('newPassword' | 'confirmPassword')} controlName
   * @returns {boolean}
   * @memberof NewPasswordFormComponent
   */
  shouldDisplayInputError = (controlName: ('newPassword' | 'confirmPassword')): boolean => {
    const formControl: AbstractControl = this.newPasswordFormGroup.get(controlName);
    return formControl.touched && formControl.invalid;
  };

  /**
   * @desc Initiates login process with new password set
   * @memberof NewPasswordFormComponent
   */
  onNewPasswordInputed = (): void => {
    if (this.newPasswordFormGroup.valid) {
      const newPassword = this.newPasswordFormGroup.get('newPassword').value;
      this.auth.setNewPassword(newPassword);
      this.auth.login();
    }
  };
}
