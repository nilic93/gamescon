import { Component, OnInit } from '@angular/core';
import { UserPaymentData } from '../../models/user-payment-data.model';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-payment-details-modal',
  templateUrl: './user-payment-details-modal.component.html',
  styleUrls: ['./user-payment-details-modal.component.scss']
})
export class UserPaymentDetailsModalComponent {
  public episodeDetails: UserPaymentData;

  constructor(public bsModalRef: BsModalRef) { }
  /**
   * @desc Extracts payment date from file name where payment is processed
   * @param {string} processFilename File name that only can have extension .csv or .xml
   * @returns {string} Date string in format dd-mm-yyyy if passed correct parameter else returns '/'
   * @memberof EpisodeDetailsModalComponent
   */
  extractPaymentDate = (processFilename: string): string => {
    if (processFilename) {
      const splittedFilename = processFilename.split(/[_.]/);
      const dateString = splittedFilename[splittedFilename.length - 2];
      const day = dateString.substring(6, 8);
      const month = dateString.substring(4, 6);
      const year = dateString.substring(0, 4);
      return `${day}-${month}-${year}`;
    } else {
      return '/';
    }
  };

  getStatusLabelClass = (status) => {
    switch (status) {
      case 'Payment successful':
        return 'status-label status-label--green';
      case 'Prize claimed':
        return 'status-label status-label--blue';
      case 'Not claimed':
        return 'status-label status-label--orange';
      default:
        return '';
    }
  }
}
