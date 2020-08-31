import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FindUserModule } from '../../find-user.module';

import { SearchInputComponent } from './search-input.component';
import { FetchUserDataService } from '../../fetch-data.service';
import { SearchParams } from '../../../shared/models/find-user-search-params.model';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FindUserModule],
      providers: [FetchUserDataService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test getInputErrorMessage()', () => {
    it('Should return "Please enter valid email." if entered invalid email', () => {
      component.updateValidation('byEmail', 0);
      component.searchFormGroup.controls['searchInput0'].setValue('test@tes');
      fixture.detectChanges();
      const returnedValue = component.getInputErrorMessage(0);
      expect(returnedValue).toEqual('You have to insert valid email or part of email in form %segment%, example: (angela@gmail.com or %angela%)');
    });

    it('Should return "Please enter valid email." if entered invalid paypal mail', () => {
      component.updateValidation('byPaypal', 0);
      component.searchFormGroup.controls['searchInput0'].setValue('test@tes');
      fixture.detectChanges();
      const returnedValue = component.getInputErrorMessage(0);
      expect(returnedValue).toEqual('You have to insert valid email or part of email in form %segment%, example: (angela@gmail.com or %angela%)');
    });

    it('Should return "Please enter valid Bankaccount" if entered invalid bank account number', () => {
      component.updateValidation('byBankAccount', 0);
      component.searchFormGroup.controls['searchInput0'].setValue('NL98KNAB0204');
      fixture.detectChanges();
      const returnedValue = component.getInputErrorMessage(0);
      expect(returnedValue).toEqual('Please enter valid Bankaccount.');
    });

    it('Should return empty string if entered valid email', () => {
      component.updateValidation('byEmail', 0);
      component.searchFormGroup.controls['searchInput0'].setValue('test@gmail.com');
      fixture.detectChanges();
      const returnedValue = component.getInputErrorMessage(0);
      expect(returnedValue).toEqual('');
    });

    it('Should return empty string if entered valid paypal mail', () => {
      component.updateValidation('byPaypal', 0);
      component.searchFormGroup.controls['searchInput0'].setValue('test@gmail.com');
      fixture.detectChanges();
      const returnedValue = component.getInputErrorMessage(0);
      expect(returnedValue).toEqual('');
    });

    it('Should return empty string if entered valid bank account number', () => {
      component.updateValidation('byBankAccount', 0);
      component.searchFormGroup.controls['searchInput0'].setValue('NL98KNAB0204542332');
      fixture.detectChanges();
      const returnedValue = component.getInputErrorMessage(0);
      expect(returnedValue).toEqual('');
    });

    it('Should return empty string if entered valid bank account number', () => {
      component.updateValidation('byBankAccount', 0);
      component.searchFormGroup.controls['searchInput0'].setValue('');
      fixture.detectChanges();
      const returnedValue = component.getInputErrorMessage(0);
      expect(returnedValue).toEqual('You must enter search value for bankaccount');
    });
  })

  describe('Test updateValidation()', () => {
    it('Should set searchTypeDisplay and searchType ', () => {
      component.updateValidation('byBankAccount', 0);
      expect(component.inputParameters[0].searchType).toBe('byBankAccount');
      expect(component.inputParameters[0].searchTypeDisplay).toBe('BankAccount');
    });

    it('Should set searchTypeDisplay and searchType ', () => {
      component.updateValidation('byEmail', 0);
      expect(component.inputParameters[0].searchType).toBe('byEmail');
      expect(component.inputParameters[0].searchTypeDisplay).toBe('Email');
    });
  })

  describe('Test onSubmit()', () => {
    it('Should call next()', () => {
      const params = [
        {
          searchIdentifier: 'test@email.com',
          searchType: 'byEmail'
        },
        {
          searchIdentifier: "",
          searchType: "byEmail"
        }];
      const spy = jest.spyOn(component.paramsInputed, 'next');
      component.inputParameters[0].searchType = 'byEmail';
      component.searchFormGroup.controls['searchInput0'].setValue('test@email.com');
      component.onSubmit();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toBeCalledWith(params);

      component.paramsInputed.subscribe((params) => {
        expect(params).toEqual(params)
      })
    });

    it('Should not call next()', () => {
      const params = [
        {
          searchIdentifier: 'test@email.com',
          searchType: 'byEmail'
        },
        {
          searchIdentifier: "",
          searchType: "byEmail"
        }];
      const spy = jest.spyOn(component.paramsInputed, 'next');
      component.inputParameters[0].searchType = 'byEmail';
      component.searchFormGroup.controls['searchInput0'].setValue('test@em');
      component.onSubmit();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(0);
    });

  });

  describe('Test setSearchParams()', () => {
    it('should manage change of search type and set value in input field\
    according to given search params', () => {
      const testParams: SearchParams = {
        searchType: 'byPaypal',
        searchIdentifier: 'test@email.com'
      };
      const updateValidationSpy = jest.spyOn(component, 'updateValidation');

      component.updateFromHistory(testParams);

      expect(updateValidationSpy).toBeCalledTimes(1);
      expect(updateValidationSpy).toBeCalledWith(testParams.searchType, 0);
      expect(component.searchFormGroup.get('searchInput0').value).toEqual(testParams.searchIdentifier);
    });
  });
});
