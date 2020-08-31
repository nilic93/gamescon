import { AbstractControl } from '@angular/forms';
import { FormErrors } from '../enums/form-errors/form-errors.enum';

/**
 * @desc moneyValidator is function that validates money value
 * @returns { [key: string]: any } | null
 */
export const taxValidator = (control: AbstractControl): { [key: string]: any } | null => {
  if (control.value) {
    return isValidValue(control.value) ? null : { tax: { value: FormErrors.MONEY_VALUE } } ;
  }
};

const isValidValue = (value:string) => {
  const regex = /^[0-9]{1}([0-9]?){0,2}.[0-9]{2}$/i;
  return regex.test(value);
}
