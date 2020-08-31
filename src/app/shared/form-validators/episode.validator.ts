import { AbstractControl } from '@angular/forms';
import { FormErrors } from '../enums/form-errors/form-errors.enum';

/**
 * @desc validatorEmail is function that validates email
 * @returns { [key: string]: any } | null
 */
export const validatorEpisode = (control: AbstractControl): { [key: string]: any } | null => {
  if (control.value) {
    const episode = control.value;
    const regex = /^S\d+E\d+$/;
    const bool = regex.test(episode);
    return !bool ? { episode: { value: FormErrors.EPISODE } } : null;
  }
};