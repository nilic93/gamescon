import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { EpisodeInfo } from '../shared/models/episode-info.model';
import { EpisodeDisplay } from '../shared/models/episode-display.model';
import { PrizeData } from '../shared/models/prize-data.model';
import { UserPaymentData } from '../shared/models/user-payment-data.model';
import config from 'environments/config';

@Injectable()
export class FetchEpisodesDataService {
  currentSearchParams: any;

  constructor(private http: HttpClient) { }

  fetchEpisodesData$ = (): Observable<any> => {
    this.currentSearchParams = {};

    return this.http.get(`${config.getAwsURL()}episodes`).pipe(
      map((response: { body: EpisodeInfo[], total: number }) => {
        return {
          body: this.extractEpisodeData(response.body),
          total: response.total
        };
      })
    );
  };

  /**
   * @desc Makes API call in order to fetch info data about all winners in episode with specified episodeID
   * Also it transforms observable in order to prepare data for display
   * @returns {{winners: UserPaymentData[], prizeData: PrizeData}} Observable with transformed data that is ready for display
   * @memberof FetchEpisodesDataService
   */
  fetchEpisodeWinnersData$ = (
    episodeID: string,
    orderBy?: string,
    order?: ('asc' | 'desc' | ""),
    page?: number,
    perPage?: number
  ): Observable<{ winners: UserPaymentData[], prizeData: PrizeData, pagesCount: number, total: number }> => {
    this.currentSearchParams = {
      episodeIdentifier: episodeID,
      order: order,
      orderBy: orderBy,
      page: page,
      perPage: perPage
    };

    let queryStrings = new HttpParams().set('episodeIdentifier', `${episodeID}`);

    if (orderBy && order) {
      queryStrings = queryStrings.append('orderBy', `${orderBy}`);
      queryStrings = queryStrings.append('order', `${order}`);
    }

    if (page && perPage) {
      queryStrings = queryStrings.append('perPage', `${perPage}`);
      queryStrings = queryStrings.append('page', `${page}`);
    }

    return this.http.get(`${config.getAwsURL()}payments/episode`, { params: queryStrings }).pipe(
      map((res: { body: UserPaymentData[], pagesCount: number, total: number, allUsers: UserPaymentData[] }) => {
        return {
          winners: res.body,
          prizeData: this.extractPrizeData(res.allUsers),
          pagesCount: res.pagesCount,
          total: res.total
        };
      })
    );
  };

  /**
   * @desc Takes data recieved as a response when fetching episodes, calculates number of winners in episode and
   * transforms dates and other data specified in interface EpisodeDisplay in desired format
   * @param {EpisodeInfo[]} data Response data recieved from API
   * @returns {EpisodeDisplay[]} Array of objects with specified properties
   * @private
   * @memberof FetchEpisodesDataService
   */
  extractEpisodeData = (data: EpisodeInfo[]): EpisodeDisplay[] => {
    return data
      .map(elem => {
        const totalAmount = this.extractFrom(elem.attributes.settings, 'number');
        const amountPerWinner = this.extractFrom(elem.attributes.settings, 'winner_prize');
        const winnersCount = this.numberOfWinners(totalAmount, amountPerWinner);
        const startTime = moment(elem.attributes.start_at_iso).utc().local().format('HH:mm');
        const endTime = moment(elem.attributes.end_at_iso).utc().local().format('HH:mm');

        return {
          // TODO: Hardcoded season number
          episodeID: `S1E${this.extractFrom(elem.attributes.settings, 'episode_number')}`,
          date: moment(elem.attributes.start_at_iso).format('DD/MM/YYYY'),
          time: `${startTime} - ${endTime}`,
          totalAmount: isNaN(totalAmount) ? '/' : '€' + totalAmount,
          amountPerWinner: isNaN(amountPerWinner) ? '/' : '€' + amountPerWinner,
          numberOfWinners: isNaN(winnersCount) ? '/' : winnersCount.toFixed(0)
        };
      }).reverse();
  };

  /**
   * @desc Gets lucky13 and double13 amount from data recieved as a response (when fetching winners per episode) in first pass
   * then counts number of lucky13 and double13 winners
   * @param {UserPaymentData[]} data Array of user payment data for requested episode and specified user
   * @returns {PrizeData} object with amount and count of lucky13 and double13 winners
   * @private
   * @memberof FetchEpisodesDataService
   */
  extractPrizeData = (data: UserPaymentData[]) => {
    const prizeData: PrizeData = {
      lucky13: {
        amount: '0.00',
        count: 0,
      },
      double13: {
        amount: '0.00',
        count: 0,
      },
    };

    // TODO: REFACTOR THIS WHEN WORKING WITH REAL DATA
    if (data.length > 0) {
      const prizeAmount1 = data[0].prizemoney;

      const withDifferentAmount = data.find(el => el.prizemoney !== prizeAmount1);
      const prizeAmount2 = withDifferentAmount ? withDifferentAmount.prizemoney : '0.00';

      if (+prizeAmount1 < +prizeAmount2 || prizeAmount2 === '0.00') {
        prizeData.lucky13.amount = prizeAmount1;
        prizeData.double13.amount = prizeAmount2;
      } else {
        prizeData.lucky13.amount = prizeAmount2;
        prizeData.double13.amount = prizeAmount1;
      }

      data.forEach(item => {
        if (item.prizemoney === prizeData.lucky13.amount) {
          prizeData.lucky13.count++;
        } else {
          prizeData.double13.count++;
        }
      });
    }

    return prizeData;
  };

  /**
   * @desc Extracts total amount or winner prize depends on second parameter (if exist in array)
   * @param array , byCriteria
   * @returns exact value that is requested for that episode or NaN
   * @memberof FetchEpisodesDataService
   */
  extractFrom = (array: any[], byCriteria: string): number => {
    const setting = array.find((element) => {
      return element.key === byCriteria;
    });
    if (setting) {
      return setting.values.all !== null ? setting.values.all : NaN
    }
    return NaN;
  }

  /**
   * @desc Calculate number of winners for episode
   * @param totalAmount, amountPerWinner
   * @returns number of winners or NaN
   * @memberof FetchEpisodesDataService
   */
  numberOfWinners = (totalAmount, amountPerWinner) => {
    return ((parseInt(totalAmount) !== NaN) && (parseInt(amountPerWinner) !== NaN)) ?
      (totalAmount / amountPerWinner) : NaN;
  }

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

    for (const param in this.currentSearchParams) {
      if (this.currentSearchParams[param]) {
        queryStrings = queryStrings.append(param, this.currentSearchParams[param]);
      }
    }

    return this.http.get(`${config.getAwsURL()}report`, { params: queryStrings });
  }
}
