import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import config from 'environments/config';

@Injectable()
export class PayoutFilesDataService {

  constructor(private http: HttpClient) { }

  fetchPayoutFilesInfo$ = (dateSelect): Observable<any> => {
    const { year, month, day } = dateSelect;
    let queryStrings = new HttpParams();

    if (year) {
      queryStrings = queryStrings.append('year', `${year}`);
    }

    if (month) {
      queryStrings = queryStrings.append('month', `${month}`);
    }

    if (day) {
      queryStrings = queryStrings.append('day', `${day}`);
    }

    return this.http.get(`${config.getAwsURL()}payout-files`, { params: queryStrings });
  }

  fetchDownloadLink$ = (Key: string): Observable<any> => {
    let queryStrings = new HttpParams().set('Key', Key);
    return this.http.get(`${config.getAwsURL()}payout-files/download`, { params: queryStrings });
  }
}
