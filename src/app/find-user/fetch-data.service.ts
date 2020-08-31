import { Observable, forkJoin, Subject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserPaymentData } from './../shared/models/user-payment-data.model';
import config from 'environments/config';
import { SearchParams } from '../shared/models/find-user-search-params.model';
import { UserPaymentsSearchParams } from '../shared/models/search-params-user-payments.model';

@Injectable()
export class FetchUserDataService {
  historySearchRequested$ = new Subject<SearchParams>();
  currentSearchParams: any;

  constructor(private http: HttpClient) { }

  /**
   * @desc Makes a call to the API in order to retrive user data with given email
   * @param {string} email Email as a search parameter
   * @memberof FetchUserDataService
   * @returns {Observable<UserPaymentData>} User payment data
   */
  fetchUserPaymentData$ = (params: UserPaymentsSearchParams): Observable<any> => {
    this.currentSearchParams = params;
    const { 
      searchType,
      searchIdentifier,
      searchType2,
      searchIdentifier2,
      orderBy,
      order,
      page,
      perPage
    } = params;
    let queryStrings = new HttpParams()
      .set('searchType', `${searchType}`)
      .set('searchIdentifier', `${searchIdentifier}`);

    if (searchType2 && searchIdentifier2) {
      queryStrings = queryStrings.append('searchType2', `${searchType2}`);
      queryStrings = queryStrings.append('searchIdentifier2', `${searchIdentifier2}`);
    }

    if (orderBy && order) {
      queryStrings = queryStrings.append('orderBy', `${orderBy}`);
      queryStrings = queryStrings.append('order', `${order}`);
    }

    if (page && perPage) {
      queryStrings = queryStrings.append('page', `${page}`);
      queryStrings = queryStrings.append('perPage', `${perPage}`);
    }

    return this.http.get(`${config.getAwsURL()}payments/user`, { params: queryStrings });
  };

  /**
   * @desc Makes a call to the API in order to retrive user profile info from Gigya with given email
   * @param {string} email Email as a search parameter
   * @memberof FetchUserDataService
   * @returns {Observable<any>} User payment data
   */
  fetchUserInfo$ = (email: string) => {
    let queryStrings = new HttpParams().set('userEmail', `${email}`);
    return this.http.get(`${config.getAwsURL()}users/gigya`, { params: queryStrings });
  }

  /**
   * @desc Combines observables in order to make two http requests in parallel.
   * When returned observable completes it gives array with responses
   * @param {string} email Email as argument for two functions that return observables
   * @memberof FetchUserDataService
   * @returns {Observable<any[]>} Observable that is resolved when both observables have completed
   */
  fetchUserAndPaymentDataInParallel$ = (params: { searchIdentifier: string, searchType: string }): Observable<any[]> => {
    return forkJoin(this.fetchUserInfo$(params.searchIdentifier), this.fetchUserPaymentData$(params))
  }

  /**
   * @desc Makes API call in order to create .xls table report file
   * @param {string} lambdaName Name of lambda function that returns data to display in report
   * @param {string} tableTitle Title of the table to be included in report
   * @returns {Observable<any>} Response object with download link
   */
  createTableReport$ = (lambdaName: string, tableTitle: string): Observable<any> => {
    const { 
      searchType,
      searchIdentifier,
      searchType2,
      searchIdentifier2,
      orderBy,
      order,
      page,
      perPage
    } = this.currentSearchParams;

    let queryStrings = new HttpParams()
      .set('lambdaName', lambdaName)
      .set('tableTitle', tableTitle)
      .set('searchType', `${searchType}`)
      .set('searchIdentifier', `${searchIdentifier}`);

    if (searchType2 && searchIdentifier2) {
      queryStrings = queryStrings.append('searchType2', `${searchType2}`);
      queryStrings = queryStrings.append('searchIdentifier2', `${searchIdentifier2}`);
    }

    if (orderBy && order) {
      queryStrings = queryStrings.append('orderBy', `${orderBy}`);
      queryStrings = queryStrings.append('order', `${order}`);
    }

    if (page && perPage) {
      queryStrings = queryStrings.append('page', `${page}`);
      queryStrings = queryStrings.append('perPage', `${perPage}`);
    }
  
    return this.http.get(`${config.getAwsURL()}report`, { params: queryStrings });
  }
}
