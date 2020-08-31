import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { SearchParams } from '../../../shared/models/find-user-search-params.model';
import { FetchUserDataService } from '../../fetch-data.service';
import { validatorBankAcc } from 'app/shared/form-validators/bank-account.validator';
import { validatorEmailOrPartEmail } from 'app/shared/form-validators/multiple.validator';


@Component({
  selector: 'search-input-cmp',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Output() paramsInputed = new Subject<SearchParams[]>();
  searchFormGroup: FormGroup;
  inputParameters: SearchParams[];
  historySearchSubscription: Subscription;
  secondInputExist: boolean;

  constructor(private fetchUserDataService: FetchUserDataService) {
    this.secondInputExist = false;
    this.inputParameters = [
      {
        searchType: 'byEmail',
        searchIdentifier: '',
        searchTypeDisplay: 'Email'
      },
      {
        searchType: 'byEmail',
        searchIdentifier: '',
        searchTypeDisplay: 'Email'
      }
    ]
  }

  ngOnInit() {
    this.searchFormGroup = new FormGroup({
      searchInput0: new FormControl('', [Validators.required, validatorEmailOrPartEmail]),
      searchInput1: new FormControl('', [])
    });

    this.historySearchSubscription = this.fetchUserDataService
      .historySearchRequested$
      .subscribe(this.updateFromHistory);
  }

  /**
   * @desc Sets search type and value in the search input form when user selects search record from history
   * @param {SearchParams} params Search params chosen from history
   * @memberof SearchInputComponent
   */
  updateFromHistory = (params: SearchParams): void => {
    this.updateValidation(params.searchType, 0);
    this.searchFormGroup.controls[`searchInput${0}`].setValue(params.searchIdentifier);
  }

  /**
   * @desc This is a method for getting input error
   * @param {number} inputID
   * @memberof EmailUserInputComponent
   * @returns {String} Input error message to be displayed
   */
  getInputErrorMessage = (inputID: number): string => {
    const searchInput = this.searchFormGroup.get(`searchInput${inputID}`);
    if (searchInput.hasError('required')) {
      if (this.inputParameters[inputID].searchType === 'byBankAccount') {
        return `You must enter search value for ${this.inputParameters[inputID].searchTypeDisplay.toLowerCase()}`;
      } else {
        return `You must enter search value for ${this.inputParameters[inputID].searchTypeDisplay.toLowerCase()} or valid form to search by part of that information`;
      }
    } else if (searchInput.hasError('email')) {
      return searchInput.errors['email'].value;
    } else if (searchInput.hasError('invalidBankAcc')) {
      return searchInput.errors['invalidBankAcc'].value;
    } else {
      return '';
    }
  }

  /**
   * @desc This is method that is fired when user submits form ither by press enter keyboard key when form input field is focused
   *  or on 'Search' button click. If user input is valid, it passes inputed email to it's parent component (FindUserComponent)
   * @memberof SearchInputComponent
   */
  onSubmit = (): void => {
    if (this.searchFormGroup.valid) {
      const params: SearchParams[] = [
        {
        searchIdentifier: this.searchFormGroup.controls[`searchInput${0}`].value,
        searchType: this.inputParameters[0].searchType
        },
        {
          searchIdentifier: this.searchFormGroup.controls[`searchInput${1}`].value,
          searchType: this.inputParameters[1].searchType
        }];
      this.paramsInputed.next(params);
    }
  };

  /**
   * @desc This is method updates searchTypeDisplay, searchType and validator and resets form
   * @memberof SearchInputComponent
   * @param  searchType
   */
  updateValidation = (searchType: string, inputID: number): void => {
    this.inputParameters[inputID].searchType = searchType;

    if (searchType === 'byBankAccount') {
      this.inputParameters[inputID].searchTypeDisplay = 'BankAccount';
      this.searchFormGroup.controls[`searchInput${inputID}`].setValidators([Validators.required, validatorBankAcc])
    }
    else if (searchType === 'byPaypal') {
      this.inputParameters[inputID].searchTypeDisplay = 'Paypal mail';
      this.searchFormGroup.controls[`searchInput${inputID}`].setValidators([Validators.required, validatorEmailOrPartEmail])
    }
    else if (searchType === 'byEmail') {
      this.inputParameters[inputID].searchTypeDisplay = 'Email';
      this.searchFormGroup.controls[`searchInput${inputID}`].setValidators([Validators.required, validatorEmailOrPartEmail])
    }
    else {
      console.error(`[search-input] Unknown search type for "${searchType}".`);
    }
    this.searchFormGroup.controls[`searchInput${inputID}`].setValue("");
  }


  /**
   * @desc This method unfocus button
   * @memberof SearchInputComponent
   */
  unFocus = (event): void => {
    event.srcElement.blur();
  }

  ngOnDestroy(): void {
    this.historySearchSubscription.unsubscribe();
  }


  /**
   * @desc This method deletes second input element and resets its value to default
   * @memberof SearchInputComponent
   */
  removeSecondFilter = () => {
    this.secondInputExist = false;
    this.searchFormGroup.controls[`searchInput${1}`].setValidators([]);
    this.searchFormGroup.controls[`searchInput${1}`].setValue('');
    this.inputParameters[1] = {
      searchType: 'byEmail',
      searchIdentifier: '',
      searchTypeDisplay: 'Email'
    }
  }

  /**
   * @desc This method creates second input element and sets default validation
   * @memberof SearchInputComponent
   */
  addSecondFilter = () => {
    this.secondInputExist = true;
    this.searchFormGroup.controls[`searchInput${1}`].setValidators([Validators.required, validatorEmailOrPartEmail]);
  }
}
