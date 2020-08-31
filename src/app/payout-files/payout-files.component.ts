import { Component, OnInit, OnDestroy } from '@angular/core';
import { PayoutFilesDataService } from './payout-files.service';
import { Subscription } from 'rxjs';
import { TableConfig } from 'app/shared/models/table-config.model';
import * as moment from 'moment';

@Component({
  selector: 'payout-files-cmp',
  templateUrl: './payout-files.component.html',
  styleUrls: ['./payout-files.component.scss'],
  providers: [PayoutFilesDataService]
})
export class PayoutFilesComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;
  urlSubscription: Subscription;
  payoutFilesTableConfig: TableConfig;
  lastDateSelection: any;
  isLoading: boolean;
  gotEmptyResponse: boolean;

  constructor(private payoutFilesDataService: PayoutFilesDataService) {
    this.isLoading = false;
    this.gotEmptyResponse = false;
  }

  ngOnInit() {

  }

  fetchpayoutFilesInfo = (dateSelection): void => {
    this.isLoading = true;
    this.gotEmptyResponse = false;
    this.lastDateSelection = dateSelection;
    this.dataSubscription = this.payoutFilesDataService.fetchPayoutFilesInfo$(dateSelection).subscribe(this.handlePaymentFilesResponse);
  }

  handlePaymentFilesResponse = (response) => {
    if (Array.isArray(response.body)) {
      if (!response.body.length) {
        this.gotEmptyResponse = true;
      } else {
        this.configurePayoutFilesTable(response);
      }
    }
    this.isLoading = false;
  }

  configurePayoutFilesTable = (response = { body: [], total: 0 }) => {
    this.payoutFilesTableConfig = {
      title: 'Payout files',
      columns: [
        {
          columnHeader: 'Filename',
          dataKey: 'name',
          tooltip: true
        },
        {
          columnHeader: 'Type',
          dataKey: 'type'
        },
        {
          columnHeader: 'Size',
          dataKey: 'size'
        },
        {
          columnHeader: 'Last modified date',
          dataKey: 'creationDate'
        },
        {
          columnHeader: 'Action',
          dataKey: 'action',
          cellAction: 'download',
          isCellClickable: true
        },
      ],
      rows: response.body,
      hasNumeration: true,
      isScrollable: true,
      maxHeight: 'calc(100vh - 310px)',
      totalRecordsCount: response.total
    }
  }

  onDownloadPayoutFile = (rowData) => {
    this.urlSubscription = this.payoutFilesDataService.fetchDownloadLink$(rowData.Key).subscribe(this.downloadPayoutFile);
  }

  downloadPayoutFile = (response: { body: string }): void => {
    const signedUrl = response.body;
    window.open(signedUrl);
  }

  getLastDateSelection = (): string => {
    const DD = this.lastDateSelection.day ? ('0' + this.lastDateSelection.day).slice(-2) + '. ' : '';
    const MM = this.lastDateSelection.month ? moment.months()[this.lastDateSelection.month - 1] + ' ' : '';
    const YYYY = this.lastDateSelection.year + '.' || '';
    return DD + MM + YYYY;
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.urlSubscription) {
      this.urlSubscription.unsubscribe();
    }
  }
}
