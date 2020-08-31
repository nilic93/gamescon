import { isEmail } from 'validator';
import { AbstractControl } from '@angular/forms';
import { FormErrors } from '../enums/form-errors/form-errors.enum';
import { segmentSearch } from "../utils/segment-search/segment-search";

/**
 * @desc validatorEmailOrPartEmail is function that validates email or part of an email
 * @returns { [key: string]: any } | null
 */
export const validatorEmailOrPartEmail = (control: AbstractControl): { [key: string]: any } | null => {
  if (control.value) {
    const searchBySegment = segmentSearch(control.value);
    return (!isEmail(control.value) && !searchBySegment) ? { email: { value: FormErrors.EMAIL_PART_INVALID } } : null;
  }
};