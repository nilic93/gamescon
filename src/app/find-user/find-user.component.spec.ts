import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUserComponent } from './find-user.component';
import { FindUserModule } from './find-user.module';
import { FetchUserDataService } from './fetch-data.service';
import { DEFAULT_USER_PROFILE } from '../shared/constants/default-user-profile';
import { defaultGigyaResponseMock } from '../shared/mocks/gigya-search-user-response';
import { userPaymentDataResponseMock } from '../shared/mocks/user-payment-data-response';
import { SearchParams } from '../shared/models/find-user-search-params.model';

describe('FindUserComponent', () => {
  let component: FindUserComponent;
  let fixture: ComponentFixture<FindUserComponent>;
  let fetchUserDataService: FetchUserDataService;
  let dataMock: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FindUserModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindUserComponent);
    component = fixture.componentInstance;
    fetchUserDataService = fixture.debugElement.injector.get(
      FetchUserDataService
    );
    fixture.detectChanges();
    dataMock = require('./../../assets/find-user.json');
  });

  test('component creation', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading).toEqual(false);
    expect(component.isDataRetrived).toEqual(false);
  });

  describe('Test getSearchHistory()', () => {
    test('should set searchHistory property to [] if "searchHistory" doesn\'t exists in localStorage', () => {
      component.getSearchHistory();
      expect(component.searchHistory).toEqual([]);
    });

    test('should get searchHistory if exists in localStorage', () => {
      const testHistory = [
        {
          searchType: 'byPaypal',
          searchIdentifier: 'test@email.com',
          searchTypeDisplay: 'PayPal mail'
        }
      ];
      localStorage.setItem('searchHistory', JSON.stringify(testHistory));

      component.getSearchHistory();
      expect(component.searchHistory).toEqual(testHistory);
      localStorage.clear();
    });
  });

  describe('Test updateSearchHistory()', () => {
    it('should adjust and add given record to search history in localStorage', () => {
      const adjustSpy = jest.spyOn(component, 'adjustSearchHistoryRecord');
      const testRecord = {
        searchType: 'byPaypal',
        searchIdentifier: 'test@email.com'
      };
      localStorage.clear();

      component.updateSearchHistory(testRecord);

      const expectedAdjustedRecord = {
        ...testRecord,
        searchTypeDisplay: 'PayPal mail'
      };
      expect(adjustSpy).toBeCalledTimes(1);
      expect(adjustSpy).toBeCalledWith(testRecord);
      const firstRecord = JSON.parse(localStorage.getItem('searchHistory'))[0];
      expect(component.searchHistory).toEqual([expectedAdjustedRecord]);
      expect(firstRecord).toEqual(expectedAdjustedRecord);
      adjustSpy.mockClear();
    });

    test('should adjust and add at first place given record and remove last record\
    if there are greater or equal to 10 records in localStorage', () => {
      const adjustSpy = jest.spyOn(component, 'adjustSearchHistoryRecord');
      const testRecord = {
        searchType: 'byPaypal',
        searchIdentifier: 'test@email.com'
      };
      localStorage.clear();
      const testSearchHistory = [];
      for (let i = 0; i < 10; i++) {
        testSearchHistory.push({
          searchIdentifier: `${i}test@email.com`,
          searchType: 'byEmail',
          searchTypeDisplay: 'Email'
        });
      }
      localStorage.setItem('searchHistory', JSON.stringify(testSearchHistory));
      component.searchHistory = testSearchHistory;

      component.updateSearchHistory(testRecord);

      const expectedAdjustedRecord = {
        ...testRecord,
        searchTypeDisplay: 'PayPal mail'
      };
      expect(adjustSpy).toBeCalledTimes(1);
      expect(adjustSpy).toBeCalledWith(testRecord);

      expect(component.searchHistory[0]).toEqual(expectedAdjustedRecord);
      expect(component.searchHistory[9].searchIdentifier).toEqual(
        '8test@email.com'
      );

      const searchHistoryFromLocalStorage = JSON.parse(
        localStorage.getItem('searchHistory')
      );
      const firstRecord = searchHistoryFromLocalStorage[0];
      const lastRecord = searchHistoryFromLocalStorage[9];

      expect(firstRecord).toEqual(expectedAdjustedRecord);
      expect(lastRecord.searchIdentifier).toEqual('8test@email.com');

      adjustSpy.mockClear();
    });
  });

  describe('Test adjustSearchHistoryRecord()', () => {
    it('should add correct property searchTypeDisplay to given searchHistory record with searchType "byEmail"', () => {
      const testRecord: SearchParams = { searchIdentifier: 'test@test', searchType: 'byEmail' };

      const adjustedRecord = component.adjustSearchHistoryRecord(testRecord);

      expect(adjustedRecord).toEqual({
        ...testRecord,
        searchTypeDisplay: 'Email'
      });
    });

    it('should add correct property searchTypeDisplay to given searchHistory record with searchType "byBankAccount"', () => {
      const testRecord: SearchParams = { searchIdentifier: 'test@test', searchType: 'byBankAccount' };

      const adjustedRecord = component.adjustSearchHistoryRecord(testRecord);

      expect(adjustedRecord).toEqual({
        ...testRecord,
        searchTypeDisplay: 'Bank account'
      });
    });

    it('should add correct property searchTypeDisplay to given searchHistory record with searchType "byPaypal"', () => {
      const testRecord: SearchParams = { searchIdentifier: 'test@test', searchType: 'byPaypal' };

      const adjustedRecord = component.adjustSearchHistoryRecord(testRecord);

      expect(adjustedRecord).toEqual({
        ...testRecord,
        searchTypeDisplay: 'PayPal mail'
      });
    });

    it('should add correct property searchTypeDisplay to given searchHistory record with searchType "byEmail"', () => {
      const testRecord: SearchParams = { searchIdentifier: 'test@test', searchType: 'bad-type' };

      const adjustedRecord = component.adjustSearchHistoryRecord(testRecord);

      expect(adjustedRecord).toEqual({
        ...testRecord,
        searchTypeDisplay: 'UNKNOWN!'
      });
    });
  });


  describe('Test setWinInfoToUserProfile()', () => {
    it('should return UserProfile object with inputedEmail, calculated totalAmount and wonEpisodesCount info\
     if passed as arg array of UserPaymentData objects', () => {
      component.inputedSearchIdentifier = 'test@test.com';
      component.setWinInfoToUserProfile(dataMock.data);
      expect(component.userProfile).toEqual({
        ...DEFAULT_USER_PROFILE,
        email: component.inputedSearchIdentifier,
        wonEpisodesCount: 12,
        totalAmountWon: '72.49'
      });
    });

    it('should return default UserProfile object with inpuded email value if passed as arg empty array', () => {
      component.inputedSearchIdentifier = 'test@test.com';
      component.setWinInfoToUserProfile([]);
      expect(component.userProfile).toEqual({
        ...DEFAULT_USER_PROFILE,
        email: component.inputedSearchIdentifier
      });
    });
  });

  describe('Test onInputed()', () => {
    it('should call findUserService.fetchUserPaymentData$, store inputed email and set loading to true', () => {
      const spy = jest.spyOn(fetchUserDataService, 'fetchUserPaymentData$');
      component.onInputed([
        {
          searchIdentifier: 'test123@test.com',
          searchType: 'byEmail'
        },
        {
          searchIdentifier: 'test123@test.com',
          searchType: 'byEmail'
        }]);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.inputedSearchIdentifier).toEqual('test123@test.com');
      expect(component.isLoading).toEqual(true);
    });
  });

  describe('Test enrichUserProfile()', () => {
    it('should return same UserProfile object if user not found on Gigya, i.e. response body is {}', () => {
      const gigyaResponse = defaultGigyaResponseMock;
      const returnedUserProfile = component.enrichUserProfile(
        DEFAULT_USER_PROFILE,
        gigyaResponse
      );
      expect(returnedUserProfile).toEqual(DEFAULT_USER_PROFILE);
    });

    it('should set all values to UserProfile object that comes from gigya response object\
    if gigya response contain property "createdOn" among others', () => {
      let gigyaResponse = defaultGigyaResponseMock;
      gigyaResponse.body = {
        firstName: 'first-name',
        lastName: 'last-name',
        photoURL: 'https://test.com',
        createdOn: '2018-08-31T12:20:11.784Z'
      };
      const returnedUserProfile = component.enrichUserProfile(
        DEFAULT_USER_PROFILE,
        gigyaResponse
      );
      expect(returnedUserProfile).toEqual({
        ...DEFAULT_USER_PROFILE,
        firstName: 'first-name',
        lastName: 'last-name',
        photoURL: 'https://test.com',
        createdOn: '31/08/2018 12:20',
        userFoundOnGigya: true
      });
    });

    it('should set only "createdOn" property to UserProfile object that comes from gigya response object\
    if gigya response only contain property "createdOn"', () => {
      let gigyaResponse = defaultGigyaResponseMock;
      gigyaResponse.body = {
        createdOn: '2018-08-31T12:20:11.784Z'
      };
      const returnedUserProfile = component.enrichUserProfile(
        DEFAULT_USER_PROFILE,
        gigyaResponse
      );
      expect(returnedUserProfile).toEqual({
        ...DEFAULT_USER_PROFILE,
        createdOn: '31/08/2018 12:20',
        userFoundOnGigya: true
      });
    });
  });

  it('onEmailInputed(): Should call findUserService.fetchData, store inputed email and set loading to true', () => {
    const spy = jest.spyOn(fetchUserDataService, 'fetchUserPaymentData$');
    component.onInputed([
      {
        searchIdentifier: 'test123@test.com',
        searchType: 'byEmail'
      },
      {
        searchIdentifier: 'test123@test.com',
        searchType: 'byEmail'
      }
    ]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.inputedSearchIdentifier).toEqual('test123@test.com');
    expect(component.isLoading).toEqual(true);
  });

  describe('Test storeFetchedUserData()', () => {
    it('should call findUserService.fetchUserPaymentData$, store inputed email and set loading to true', () => {
      component.inputedSearchIdentifier = 'test@test.com';
      const setWinInfoToUserProfileSPY = jest.spyOn(
        component,
        'setWinInfoToUserProfile'
      );
      const enrichUserProfileSPY = jest.spyOn(component, 'enrichUserProfile');
      const profileAfterExtractBasicUserData = {
        ...DEFAULT_USER_PROFILE,
        email: 'test@test.com',
        totalAmountWon: '11.31',
        userFoundOnGigya: false,
        wonEpisodesCount: 3
      };

      component.storeFetchedUserData([
        defaultGigyaResponseMock,
        userPaymentDataResponseMock
      ]);

      expect(component.userData).toEqual(
        userPaymentDataResponseMock.body
      );
      expect(setWinInfoToUserProfileSPY).toBeCalledTimes(1);
      expect(setWinInfoToUserProfileSPY).toBeCalledWith(component.userData);
      expect(enrichUserProfileSPY).toBeCalledTimes(1);
      expect(enrichUserProfileSPY).toBeCalledWith(
        profileAfterExtractBasicUserData,
        defaultGigyaResponseMock
      );
      expect(component.isDataRetrived).toEqual(true);
      expect(component.isLoading).toEqual(false);
    });
  });

  describe('Test setSearchInputFromHistory()', () => {
    it('should get selected record and output it into searchHistoryRecordSelected$ stream', () => {
      const streamSpy = jest.spyOn(
        fetchUserDataService.historySearchRequested$,
        'next'
      );
      component.searchHistory = [
        { searchType: 'byPaypal', searchIdentifier: 'test@email.com' }
      ];

      component.setSearchInputFromHistory(component.searchHistory[0]);

      expect(streamSpy).toBeCalledTimes(1);
      expect(streamSpy).toBeCalledWith(component.searchHistory[0]);
    });
  });

  describe('Test configureSearchHistoryTable()', () => {
    test('should configure search history table', () => {
      const testTableData = [
        { searchType: 'byPaypal', searchIdentifier: 'test@email.com' }
      ];

      component.configureSearchHistoryTable(testTableData);

      expect(component.searchHistoryTableConfig).toEqual({
        title: 'Search history',
        columns: [
          {
            columnHeader: 'Identifier',
            dataKey: 'searchIdentifier',
            shouldBeMasked: true,
            tooltip: true
          },
          { columnHeader: 'Type', dataKey: 'searchTypeDisplay' }
        ],
        rows: testTableData,
        isClickable: true,
        maxHeight: 'calc(100vh - 290px)',
        isScrollable: true,
        hasNumeration: true
      });
    });
  });
});
