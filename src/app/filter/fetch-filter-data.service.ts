import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import config from 'environments/config';
import { FilterParams } from '../shared/models/filter-params.model';

@Injectable()
export class FetchFilterDataService {
  currentFilterParams: any;

  constructor(private http: HttpClient) { }

  /**
   * @desc fetchFilterData$() fetch data from backend requested from filter page by parameters that was setted on that page
   * @params {number} minEpisodes {number} maxEpisodes {string} minPrize {string} maxPrize
   * @returns {Observable<any>} Observable with data from backend
   * @memberof FetchFilterDataService
   */
  fetchFilterData$ = (params: FilterParams): Observable<any> => {
    this.currentFilterParams = params;
  
    const { minEpisodes, maxEpisodes, minAmountWon, maxAmountWon, orderBy, order } = params;
    let queryStrings = new HttpParams().set('minEpisodes', `${minEpisodes}`).set('maxEpisodes', `${maxEpisodes}`);

    if (minAmountWon && maxAmountWon) {
      queryStrings = queryStrings.append('minAmountWon', `${minAmountWon}`);
      queryStrings = queryStrings.append('maxAmountWon', `${maxAmountWon}`);
    }

    if (orderBy && order) {
      queryStrings = queryStrings.append('orderBy', `${orderBy}`);
      queryStrings = queryStrings.append('order', `${order}`);
    }
    return this.http.get(`${config.getAwsURL()}filter`, { params: queryStrings });
  };

  /**
   * @desc Makes API call in order to create .xls table report file
   * @param {string} lambdaName Name of lambda function that returns data to display in report
   * @param {string} tableTitle Title of the table to be included in report
   * @returns {Observable<any>} Response object with download link
   */
  createTableReport$ = (lambdaName: string, tableTitle: string): Observable<any> => {

    let queryStrings = new HttpParams()
      .set('lambdaName', lambdaName)
      .set('tableTitle', tableTitle);

    // TODO: Handle case when only minEpisodes and max episodes inputed 
    // (in this case values for min(max)AmountWon are both 0 )
    if (this.currentFilterParams.minAmountWon === 0 && this.currentFilterParams.maxAmountWon === 0) {
      this.currentFilterParams.minAmountWon = "";
      this.currentFilterParams.maxAmountWon = "";
    }

    for (const param in this.currentFilterParams) {
      queryStrings = queryStrings.append(param, this.currentFilterParams[param]);
    }
    
    return this.http.get(`${config.getAwsURL()}report`, { params: queryStrings });
  }
}
