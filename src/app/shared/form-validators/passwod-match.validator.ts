import { FormGroup } from '@angular/forms';
import { FormErrors } from '../enums/form-errors/form-errors.enum';

/**
 * @desc Validates password, password must contain at least 8 characters, lowercase, uppercase, numbers and special characters
 * @returns { [key: string]: any } | null
 */
export const passwordMatchValidator = (formGroup: FormGroup): { [key: string]: any } | null => {
  const controls = formGroup.controls;
  const newPassword = controls[Object.keys(controls)[0]];
  const confirmPassword = controls[Object.keys(controls)[1]];
  if (newPassword.value !== confirmPassword.value) {
    confirmPassword.setErrors({ ...confirmPassword.errors, passwordMatch: { value: FormErrors.PASSWORD_MATCH } });
  } else {
    return null;
  }
}