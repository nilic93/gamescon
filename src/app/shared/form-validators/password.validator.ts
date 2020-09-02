import { AbstractControl } from '@angular/forms';
import { FormErrors } from '../enums/form-errors/form-errors.enum';

/**
 * @desc Validates password, password must contain at least 8 characters, lowercase, uppercase, numbers and special characters
 * @returns { [key: string]: any } | null
 */
export const validatorPassword = (control: AbstractControl): { [key: string]: any } | null => {
  if (control.value) {
    const passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return passwordPattern.test(control.value)
      ? null
      : {
        passwordFormat: {
          value: FormErrors.PASSWORD_FORMAT,
        },
      };
  }
};
