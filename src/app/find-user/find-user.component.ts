import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

import { UserProfile } from '../shared/models/user-profile.model';
import { UserPaymentData } from './../shared/models/user-payment-data.model';
import { SortConfig, TableConfig, PagingConfig } from '../shared/models/table-config.model';
import { GigyaSearchResponse } from '../shared/models/gigya-serch-response.model';
import { UserPaymentDataResponse } from '../shared/models/user-payment-data-response.model';

import { FetchUserDataService } from './fetch-data.service';
import { DEFAULT_USER_PROFILE } from '../shared/constants/default-user-profile';
import { UserPaymentDetailsModalComponent } from '../shared/components/user-payment-details-modal/user-payment-details-modal.component';
import { SearchParams } from '../shared/models/find-user-search-params.model';
import { segmentSearch } from "../shared/utils/segment-search/segment-search";
import { RequstedType } from "../shared/enums/search-request/search-request";

const INIT_PAGINATION: PagingConfig = {
  pagesCount: -1,
  currentPage: 1,
  perPage: 50
}

@Component({
  selector: 'find-user-cmp',
  moduleId: module.id,
  styleUrls: ['./find-user.component.scss'],
  templateUrl: 'find-user.component.html',
  providers: [FetchUserDataService],
})
export class FindUserComponent implements OnInit, OnDestroy {
  loadingDataSubscription: Subscription;
  tableExportSubscription: Subscription;
  inputedSearchIdentifier: string;
  isLoading: boolean;
  isDataRetrived: boolean;
  userProfile: UserProfile;
  userData: UserPaymentData[];
  visibleCard: boolean;
  visibleTotal: boolean;
  totalAmountWon: string;
  userPaymentDataTableConfig: TableConfig;
  bsModalRef: BsModalRef;
  searchHistory: SearchParams[];
  searchHistoryTableConfig: TableConfig;
  lastSearchParams: SearchParams[];
  lastSort: SortConfig;
  lastPagination: PagingConfig;

  constructor(private findUserService: FetchUserDataService, private modalService: BsModalService) {
    this.isLoading = false;
    this.isDataRetrived = false;
    this.userProfile = DEFAULT_USER_PROFILE;
    this.visibleCard = false;
    this.visibleTotal = false;
    this.totalAmountWon = '';
    this.lastPagination = INIT_PAGINATION;
  }

  ngOnInit() {
    this.getSearchHistory();
    this.configureSearchHistoryTable(this.searchHistory);
  }

  /**
   * @desc Gets search history data from localStorage
   * (stores it into the searchHistory property if exists in localStorage)
   * @memberof FindUserComponent
   */
  getSearchHistory = (): void => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    this.searchHistory = searchHistory ? searchHistory : [];
  };

  /**
   * @desc Sets configuration search history table
   * @param {SearchParams[]} tableData Array of search params objects
   * @memberof FindUserComponent
   */
  configureSearchHistoryTable = (tableData: any): void => {
    this.searchHistoryTableConfig = {
      title: 'Search history',
      columns: [
        { columnHeader: 'Identifier', dataKey: 'searchIdentifier', shouldBeMasked: true, tooltip: true },
        { columnHeader: 'Type', dataKey: 'searchTypeDisplay' },
      ],
      rows: tableData,
      isClickable: true,
      maxHeight: 'calc(100vh - 290px)',
      isScrollable: true,
      hasNumeration: true
    };
  };

  /**
   * @desc Makes API call in order to fetch sorted data by given criteria
   * @param {SortConfig} params Sort params that defines sort criteria
   * @memberof FilterComponent
   */
  sortTable = (sort: SortConfig): void => {
    this.lastSort = sort;
    const inputArray = {
      searchType: this.lastSearchParams[0].searchType,
      searchIdentifier: this.lastSearchParams[0].searchIdentifier,
      searchType2: this.lastSearchParams[1].searchType,
      searchIdentifier2: this.lastSearchParams[1].searchIdentifier,
    }
    this.loadingDataSubscription = this.findUserService
      .fetchUserPaymentData$({
        ...sort,
        ...inputArray,
        page: this.lastPagination.currentPage,
        perPage: this.lastPagination.perPage
      })
      .subscribe(this.storeUserPaymentData);
  };

  /**
   * @desc Outputs clicked row data (in searchHistoryRecordSelected$ stream) in search history table
   * @param {SearchParams} rowData Selected search history record
   * @memberof FindUserComponent
   */
  setSearchInputFromHistory = (rowData: SearchParams): void => {
    this.findUserService.historySearchRequested$.next(rowData);
  };

  /**
   * @desc Computes win info and sets it to userProfile
   * @memberof FindUserComponent
   * @param {UserData[]} data Array of user data retrived from server
   */
  setWinInfoToUserProfile = (data: UserPaymentData[]): void => {
    let userProfileData: UserProfile = { ...DEFAULT_USER_PROFILE, email: this.inputedSearchIdentifier };
    if (data.length) {
      userProfileData.totalAmountWon = this.sumTotalAmount(data);
      userProfileData.wonEpisodesCount = data.length;
    }
    this.userProfile = userProfileData;
  };

  /**
   * @desc Transforms user profile object if user created account on Gigya
   * @memberof FindUserComponent
   * @param {UserProfile} profile User profile object as input
   * @param {GigyaSearchResponse} profile User profile object as input
   * @returns {UserProfile} Enriched or unchanged user profile object
   * depending on Gigya response as an output
   */
  enrichUserProfile = (profile: UserProfile, gigyaResponse: GigyaSearchResponse): UserProfile => {
    if (gigyaResponse.body.createdOn) {
      const createdDate = moment(gigyaResponse.body.createdOn).format('DD/MM/YYYY');
      const createdTime = moment(gigyaResponse.body.createdOn)
        .utc()
        .format('HH:mm');
      profile = {
        ...this.userProfile,
        ...gigyaResponse.body,
        createdOn: `${createdDate} ${createdTime}`,
        userFoundOnGigya: true,
      };
    }
    return profile;
  };

  /**
   * @desc Stores user data that comes as a response from API when applied search by email
   * @param {[GigyaSearchResponse, UserPaymentDataResponse]} response Array of resolved data
   * @memberof FindUserComponent
   */
  storeFetchedUserData = (response: [GigyaSearchResponse, UserPaymentDataResponse]): void => {
    this.userData = response[1].body;
    this.setWinInfoToUserProfile(this.userData);
    this.userProfile = this.enrichUserProfile(this.userProfile, response[0]);
    this.configureUserPaymentDataTable(response[1]);
    this.isDataRetrived = true;
    this.isLoading = false;
  };

  /**
   * @desc Stores user payment data that comes as a response from API when not applied search by email
   * @memberof FindUserComponent
   */
  storeUserPaymentData = (response: UserPaymentDataResponse) => {
    this.userData = response.body;
    this.totalAmountWon = this.sumTotalAmount(this.userData);
    this.configureUserPaymentDataTable(response);
    this.isDataRetrived = true;
    this.isLoading = false;
  };

  /**
   * @desc Sets configuration for table in which are displayed results of search for user's payment data
   * @param {UserPaymentData[]} tableData Array of objects that comes from API as a result of search for user's payment data
   * @memberof FindUserComponent
   */
  configureUserPaymentDataTable = (response: UserPaymentDataResponse) => {
    this.userPaymentDataTableConfig = {
      title: 'Episodes overview',
      totalRecordsCount: response.total,
      columns: [
        { columnHeader: 'Payment mail', dataKey: 'email', tooltip: true, sort: { orderBy: 'email', order: 'asc' } },
        { columnHeader: 'Episode ID', dataKey: 'episode', sort: { orderBy: 'episode', order: 'asc' } },
        {
          columnHeader: 'Amount won',
          dataKey: 'prizemoney',
          isCurrency: true,
          sort: { orderBy: 'prizemoney', order: 'asc' },
          hasSum: true
        },
        {
          columnHeader: 'Payout provider',
          dataKey: 'paymentProvider',
          sort: { orderBy: 'paymentProvider', order: 'asc' },
        },
        {
          columnHeader: 'Payout identifier',
          dataKey: 'paypalIdentifier',
          shouldBeMasked: true,
          tooltip: true,
          dependsOn: { dataKey: 'paymentProvider', value: 'bank', alternativeDataKey: 'bankAccountNumber' },
          sort: { orderBy: 'bankAndPayPal', order: 'asc' },
        },
        {
          columnHeader: 'Status',
          dataKey: 'status',
          colorLabels: [
            {
              dataValue: 'Payment successful',
              color: 'green'
            },
            {
              dataValue: 'Prize claimed',
              color: 'blue'
            },
            {
              dataValue: 'Not claimed',
              color: 'orange'
            }
          ]
        }
      ],
      rows: response.body,
      isClickable: true,
      isScrollable: true,
      maxHeight: `80vh`,
      hasNumeration: true,
      hasFooter: this.visibleTotal,
      totalAmountWon: this.totalAmountWon,
      shouldExportData: true,
      pagination: {
        ...this.lastPagination,
        pagesCount: response.pagesCount
      }
    };
  };

  onPagingChanged = (pageConfig: PagingConfig) => {
    this.lastPagination = pageConfig;
    this.isLoading = true;
    const inputArray = {
      searchType: this.lastSearchParams[0].searchType,
      searchIdentifier: this.lastSearchParams[0].searchIdentifier,
      searchType2: this.lastSearchParams[1].searchType,
      searchIdentifier2: this.lastSearchParams[1].searchIdentifier,
    }
    this.loadingDataSubscription = this.findUserService
      .fetchUserPaymentData$({
        ...this.lastSort,
        ...inputArray,
        page: pageConfig.currentPage,
        perPage: pageConfig.perPage
      })
      .subscribe(this.storeUserPaymentData);
  }

  /**
   * @desc This method is called when form is submitted.
   * Manages the state while fetching user data i.e. stores retrived values
   * @param {Object} params Parameters for searching for user payment data and user profile data
   * @param {string} params.searchType One of search types: byEmail or byPaypal or byBankAccount
   * @param {string} params.searchIdentifier Search value
   * @memberof FindUserComponent
   */
  onInputed = (params: SearchParams[]) => {
    this.lastPagination = INIT_PAGINATION;
    this.inputedSearchIdentifier = params[0].searchIdentifier;
    this.isLoading = true;
    this.lastSearchParams = params;
    this.updateSearchHistory(params[0]);
    this.fetchDataAndUpdateUI(params);
  };

  fetchDataAndUpdateUI = (params: SearchParams[]) => {
    if (!params[1].searchIdentifier) {
      let requested: RequstedType = this.defineRequestedSearch(params[0]);
      switch (requested) {
        case RequstedType.EMAIL_SEARCH:
          this.visibleCard = true;
          this.visibleTotal = false;
          this.fetchData(params, requested);
          break;

        case RequstedType.BANK_OR_PAYPAL_SEARCH:
          this.visibleCard = false;
          this.visibleTotal = true;
          this.fetchData(params, requested);
          break;

        case RequstedType.SEGMENT_SEARCH:
          this.visibleCard = false;
          this.visibleTotal = false;
          this.fetchData(params, requested);
          break;
      }
    } else {
      this.visibleCard = false;
      this.visibleTotal = false;
      this.fetchData(params, RequstedType.MULTIPLE);
    }

  }

  fetchData = (params: SearchParams[], requsted: RequstedType) => {
    if (requsted === RequstedType.EMAIL_SEARCH) {
      this.loadingDataSubscription = this.findUserService
        .fetchUserAndPaymentDataInParallel$(params[0])
        .subscribe(this.storeFetchedUserData);
    } else {
      const inputArray = {
        searchType: params[0].searchType,
        searchIdentifier: params[0].searchIdentifier,
        searchType2: params[1].searchType,
        searchIdentifier2: params[1].searchIdentifier,
      }
      this.loadingDataSubscription = this.findUserService
        .fetchUserPaymentData$(inputArray)
        .subscribe(this.storeUserPaymentData);
    }
  }

  defineRequestedSearch = (params: SearchParams): RequstedType => {
    let request: RequstedType = RequstedType.EMAIL_SEARCH;
    const searchBySegment: boolean = segmentSearch(params.searchIdentifier);
    if (searchBySegment) {
      request = RequstedType.SEGMENT_SEARCH;
    } else {
      if (params.searchType === 'byEmail') {
        request = RequstedType.EMAIL_SEARCH;
      } else {
        request = RequstedType.BANK_OR_PAYPAL_SEARCH;
      }
    }
    return request;
  }

  /**
   * @desc Opens the modal dialog which displays user payment with more details
   * @param {UserPaymentData} rowData Payment data in selected row
   * @memberof FindUserComponent
   */
  showPaymentDetails = (rowData: UserPaymentData) => {
    this.bsModalRef = this.modalService.show(UserPaymentDetailsModalComponent, {
      initialState: { episodeDetails: rowData },
    });
  };

  /**
   * @desc This method returns summary of all prizemoney that user won
   * @param {UserPaymentData[]} array
   * @memberof FindUserComponent
   * @return {string} Summary prize amount that user won
   */
  sumTotalAmount = (array: UserPaymentData[]) => {
    return array
      .reduce((accumulator, temp) => {
        return accumulator + parseFloat(temp.prizemoney);
      }, 0.0)
      .toFixed(2);
  };

  /**
   * @desc Updates local storage object that holds search history data
   * @param {SearchParams} record Object that holds last submintted search parameters (search type and value)
   * @memberof FindUserComponent
   */
  updateSearchHistory = (record: SearchParams): void => {
    const adjustedRecord = this.adjustSearchHistoryRecord(record);
    if (this.searchHistory.length >= 10) {
      this.searchHistory.unshift(adjustedRecord);
      this.searchHistory.pop();
    } else {
      this.searchHistory.unshift(adjustedRecord);
    }
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  };

  /**
   * @desc Adjusts search history record's searchType property before storing it into localStorage
   * @param {SearchParams} record Object that holds last submintted search parameters (search type and value)
   * @memberof FindUserComponent
   */
  adjustSearchHistoryRecord = (record: SearchParams): SearchParams => {
    if (record.searchType === 'byEmail') {
      return { ...record, searchTypeDisplay: 'Email' };
    } else if (record.searchType === 'byBankAccount') {
      return { ...record, searchTypeDisplay: 'Bank account' };
    } else if (record.searchType === 'byPaypal') {
      return { ...record, searchTypeDisplay: 'PayPal mail' };
    } else {
      return { ...record, searchTypeDisplay: 'UNKNOWN!' };
    }
  };

  /**
   * @desc Initiates API call for creating and storing .xls file with data currently displayed in the table
   * (API call returns url for downloading .xls file report)
   * @param {string} tableTitle Title of the table from which data is extracted
   * @memberof FindUserComponent
   */
  onExportTableData = (tableTitle: string): void => {
    this.tableExportSubscription = this.findUserService.createTableReport$('getPaymentsByUserInfo', tableTitle).subscribe(this.downloadReport);
  }

  /**
   * @desc Handles response for creating .xls table report (follows returned dowload link)
   * @param {object} response API response
   * @param {string} response.body Download link
   */
  downloadReport = (response: { body: string }): void => {
    const signedUrl = response.body;
    window.open(signedUrl);
  }

  /**
   * @desc Removes subscription if exists
   * @memberof FindUserComponent
   */
  ngOnDestroy() {
    if (this.loadingDataSubscription) {
      this.loadingDataSubscription.unsubscribe();
    }
    if (this.tableExportSubscription) {
      this.tableExportSubscription.unsubscribe();
    }
  }
}
