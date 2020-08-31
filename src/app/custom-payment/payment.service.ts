import { Injectable } from '@angular/core';
import { Payout } from "../shared/models/payout.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import config from "../../environments/config";
import { Observable } from "rxjs";

@Injectable()
export class PaymentService {
  payoutData: Payout = {
    email: '',
    prizemoney: '',
    tax: '',
    format: '',
    episode: '',
    userID: '',
    gameFormat:'Choose game format...'
  };
  gigyaUser: boolean;

  constructor(private http: HttpClient) {
  }


  /**
   * @desc Makes a call to the API in order to retrive user profile info from Gigya with given email
   * @param {string} email Email as a search parameter
   * @memberof FetchUserDataService
   * @returns {Observable<any>} User payment data
   */
  fetchUserInfo$ = (email: string): Observable<any> => {
    let queryStrings = new HttpParams().set('userEmail', `${email}`);
    return this.http.get(`${config.getAwsURL()}users/gigya`, { params: queryStrings });
  }

  isUserRegistrer = (obj) => {
    if (obj.statusCode !== 200) return false;
    let body = obj.body;
    for (let key in body) {
      return true;
    }
    return false;
  }

  putPayment$ = (): Observable<any> => {
    const dataForDynamo = {
      email: this.payoutData.email,
      prizemoney: this.payoutData.prizemoney,
      tax: this.payoutData.tax,
      format: this.payoutData.format,
      episode: this.payoutData.episode,
      userID: this.payoutData.userID,
    }
    return this.http.post(`${config.getAwsURL()}payout`, dataForDynamo);
  }

  resetPayoutData = () => {
    this.payoutData.email = '';
    this.payoutData.episode = '';
    this.payoutData.format = '';
    this.payoutData.tax = '';
    this.payoutData.prizemoney = '';
    this.payoutData.userID = '';
    this.payoutData.gameFormat = 'Choose game format ...';
  }

  setPayoutData = (data: Payout) => {
    this.payoutData = { ...data }
  }

  getPayoutData = ():Payout =>  {
    return {...this.payoutData}
  }

  getEmail = ():string => {
    let data = {...this.payoutData};
    return data.email;
  }

  getPrizeMoney = ():string => {
    let data = {...this.payoutData};
    return data.prizemoney;
  }

  getTax = ():string => {
    let data = {...this.payoutData};
    return data.tax;
  }

  getEpisode = ():string => {
    let data = {...this.payoutData};
    return data.episode;
  }

  getFormat = ():string => {
    let data = {...this.payoutData};
    return data.format;
  }
}
