import { Component, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HostListener } from '@angular/core';
import { FilterParams } from '../../../shared/models/filter-params.model';

@Component({
  selector: 'cmp-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss'],
})
export class FilterInputComponent implements OnInit {
  @Output() paramsInputed = new Subject<FilterParams>();
  filterFormGroup: FormGroup;
  minEpisodes: number;
  maxEpisodes: number;
  minPrize: string;
  maxPrize: string;
  lastValidEpisodeMin: string;
  lastValidEpisodeMax: string;
  lastValidPrizeMin: string;
  lastValidPrizeMax: string;

  constructor() {
    this.lastValidEpisodeMin = '';
    this.lastValidEpisodeMax = '';
    this.lastValidPrizeMin = '';
    this.lastValidPrizeMax = '';
    this.maxPrize = '';
    this.minPrize = '';
  }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  ngOnInit() {
    this.filterFormGroup = new FormGroup({
      minEpisodes: new FormControl('', [Validators.required, this.validationMinEpisodes]),
      maxEpisodes: new FormControl('', [Validators.required, this.validationMaxEpisodes]),
      minPrize: new FormControl('', this.validationMinPrize),
      maxPrize: new FormControl('', this.validationMaxPrize),
    });
  }

  /**
   * @desc validationMinEpisodes is function that validates minEpisodes input
   * @memberof FilterInputComponent
   * @params {AbstractControl} control
   * @returns { 'episodes': true } | null
   */
  validationMinEpisodes = (control: AbstractControl): { [key: string]: any } | null => {
    if (control && !control.pristine) {
      this.minEpisodes = Number(this.filterFormGroup.controls['minEpisodes'].value);
      if (this.minMax(this.minEpisodes, this.maxEpisodes)) {
        this.filterFormGroup.controls['maxEpisodes'].setErrors(null);
        return null;
      } else {
        this.filterFormGroup.controls['maxEpisodes'].setErrors({ episodes: 'Please enter valid range for episodes.' });
        return { episodes: 'Please enter valid range for episodes.' };
      }
    }
  };

  /**
   * @desc validationMaxEpisodes is function that validates maxEpisodes input
   * @memberof FilterInputComponent
   * @params {AbstractControl} control
   * @returns { 'episodes': true }| null
   */
  validationMaxEpisodes = (control: AbstractControl): { [key: string]: any } | null => {
    if (control && !control.pristine) {
      this.maxEpisodes = Number(this.filterFormGroup.controls['maxEpisodes'].value);
      if (this.minMax(this.minEpisodes, this.maxEpisodes)) {
        this.filterFormGroup.controls['minEpisodes'].setErrors(null);
        return null;
      } else {
        this.filterFormGroup.controls['minEpisodes'].setErrors({ episodes: 'Please enter valid range for episodes.' });
        return { episodes: 'Please enter valid range for episodes.' };
      }
    }
  };

  /**
   * @desc validationMinPrize is function that validates minPrize input
   * @memberof FilterInputComponent
   * @params {AbstractControl} control
   * @returns { 'prize': true } | null
   */
  validationMinPrize = (control: AbstractControl): { [key: string]: any } | null => {
    if (control && !control.pristine) {
      this.minPrize = this.filterFormGroup.controls['minPrize'].value;
      if (this.minMax(Number(this.minPrize), Number(this.maxPrize))) {
        this.filterFormGroup.controls['maxPrize'].setErrors(null);
        return null;
      } else {
        if (this.minPrize === '' && this.maxPrize === '') {
          this.filterFormGroup.controls['maxPrize'].setErrors(null);
          return null;
        } else {
          this.filterFormGroup.controls['maxPrize'].setErrors({ prize: 'Please enter valid range for prize money.' });
          return { prize: 'Please enter valid range for prize money.' };
        }
      }
    }
  };

  /**
   * @desc validationMaxPrize is function that validates maxPrize input
   * @memberof FilterInputComponent
   * @params {AbstractControl} control
   * @returns { 'prize': true } | null
   */
  validationMaxPrize = (control: AbstractControl): { [key: string]: any } | null => {
    if (control && !control.pristine) {
      this.maxPrize = this.filterFormGroup.controls['maxPrize'].value;
      if (this.minMax(Number(this.minPrize), Number(this.maxPrize))) {
        this.filterFormGroup.controls['minPrize'].setErrors(null);
        return null;
      } else {
        if (this.minPrize === '' && this.maxPrize === '') {
          this.filterFormGroup.controls['minPrize'].setErrors(null);
          return null;
        } else {
          this.filterFormGroup.controls['minPrize'].setErrors({ prize: 'Please enter valid range for prize money.' });
          return { prize: 'Please enter valid range for prize money.' };
        }
      }
    }
  };

  /**
   * @desc minMax is function that check if min is lower number than max or equal
   * @memberof FilterInputComponent
   * @params {number} min, {number} max
   * @returns boolean
   */
  minMax = (min: number, max: number): boolean => {
    return min > 0 && max > 0 && min <= max;
  };

  /**
   * @desc this function will be implemented
   * @memberof FilterInputComponent
   */
  onSubmit = () => {
    const params: FilterParams = {
      minEpisodes: this.minEpisodes,
      maxEpisodes: this.maxEpisodes,
      minAmountWon: +this.minPrize,
      maxAmountWon: +this.maxPrize,
    };
    this.paramsInputed.next(params);
  };

  /**
   * @desc This method unfocus button
   */
  blurOnClick = (event): void => {
    event.srcElement.blur();
  };

  /**
   * @desc checkEpisodes corrects input on Episodes fields, minEpisodeField parameter is telling which fields is active
   * if regular expression validates input then last lastValidInput for that field is updated and if is not then input is overwritten with lastValidInput
   * @memberof FilterInputComponent
   * @params event, {boolean} minEpisodeField
   */
  checkEpisodes = (event, minEpisodeField: boolean): void => {
    const content = event.target.value;
    const regexEpisodes = /^\d{0,9}$/;
    if (regexEpisodes.test(content)) {
      minEpisodeField ? (this.lastValidEpisodeMin = content) : (this.lastValidEpisodeMax = content);
    } else {
      event.target.value = minEpisodeField ? this.lastValidEpisodeMin : this.lastValidEpisodeMax;
    }
  };

  /**
   * @desc checkPrize corrects input on Prizes fields, minPrizeField parameter is telling which fields is active,
   * if regular expression validates input then lastValidInput for that field is updated and if is not then input is overwritten with lastValidInput
   * @memberof FilterInputComponent
   * @params event, {boolean} minPrizeField
   */
  checkPrize = (event, minPrizeField: boolean): void => {
    const content = event.target.value;
    const regexPrize = /^\d{0,9}((\d{1}\.)[0-9]{0,2})?$/;
    if (regexPrize.test(content)) {
      minPrizeField ? (this.lastValidPrizeMin = content) : (this.lastValidPrizeMax = content);
    } else {
      minPrizeField
        ? this.filterFormGroup.controls['minPrize'].setValue(this.lastValidPrizeMin)
        : this.filterFormGroup.controls['maxPrize'].setValue(this.lastValidPrizeMax);
    }
  };

  /**
   * @desc formatDecimals is function that format valid input on two decimals, min parameter is telling which fields is active
   * @memberof FilterInputComponent
   * @params event, min
   */
  formatDecimals = (event, min: boolean): void => {
    if (event.target.value > 0) {
      const formated = Number(event.target.value).toFixed(2);
      min
        ? this.filterFormGroup.controls['minPrize'].setValue(formated)
        : this.filterFormGroup.controls['maxPrize'].setValue(formated);
    }
  };

  /**
   * @desc getInputErrorMessage is function that returns requested errorMessage if error on input fields is present
   * @memberof FilterInputComponent
   * @returns {string}
   */
  getInputErrorMessage = (): string => {
    const minEpisodes = this.filterFormGroup.get('minEpisodes');
    const minPrize = this.filterFormGroup.get('minPrize');
    if (minEpisodes.hasError('required')) {
      return `You must enter search parameters for won episodes`;
    } else if (minEpisodes.hasError('episodes')) {
      return minEpisodes.getError('episodes');
    } else if (minPrize.hasError('prize')) {
      return minPrize.getError('prize');
    }
    return '';
  };
}
