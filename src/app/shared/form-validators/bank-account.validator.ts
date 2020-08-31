import { AbstractControl } from '@angular/forms';
import { validateBankAcc } from '../utils/validate-bank-account/validate-bank-account';
import { FormErrors } from '../enums/form-errors/form-errors.enum';

/**
 * @desc validatorBankAcc is function that validates bankAccount
 * @returns { [key: string]: any } | null
 * @memberof EmailUserInputComponent
 */
export const validatorBankAcc = (control: AbstractControl): { [key: string]: any } | null => {
  if (control.value) {
    return !validateBankAcc(control.value) ? { invalidBankAcc: { value: FormErrors.BANK_ACC_INVALID } } : null;
  }
};
