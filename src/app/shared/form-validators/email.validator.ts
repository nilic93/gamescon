import { isEmail } from 'validator';
import { AbstractControl } from '@angular/forms';
import { FormErrors } from '../enums/form-errors/form-errors.enum';

/**
 * @desc validatorEmail is function that validates email
 * @returns { [key: string]: any } | null
 */
export const validatorEmail = (control: AbstractControl): { [key: string]: any } | null => {
  if (control.value) {
    return !isEmail(control.value) ? { email: { value: FormErrors.EMAIL_INVALID } } : null;
  }
};
