import { Pipe, PipeTransform } from '@angular/core';
import { validateBankAcc } from '../../shared/utils/validate-bank-account/validate-bank-account';
/*
 * Transforms bank account number by replacing the first found sequence of seven digits
 *  with '*********', but only if is valid bank account number
 * Usage:
 *   value | mask
 * Example:
 *   {{ NL28KNAB123456789 | mask }}
 *   formats to: NL28INGB*******89
*/
@Pipe({name: 'maskBankAccount'})
export class MaskBankAccountPipe implements PipeTransform {
  transform(value: string): string {
    if(validateBankAcc(value)){
      const regex = /\d{7}(\d*)/;
      const replacementValue = `*******$1`;
      return value.replace(regex, replacementValue)
    }
    return value;
  }
}
