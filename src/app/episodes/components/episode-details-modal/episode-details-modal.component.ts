import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { UserPaymentDetailsModalComponent } from '../../../shared/components/user-payment-details-modal/user-payment-details-modal.component';
import { EpisodeDisplay } from '../../../shared/models/episode-display.model';
import { UserPaymentData } from '../../../shared/models/user-payment-data.model';
import { TableConfig, SortConfig, PagingConfig } from '../../../shared/models/table-config.model';
import { PrizeData } from '../../../shared/models/prize-data.model';
import { FetchEpisodesDataService } from '../../fetch-episodes-data.service';

const INITIAL_PAGINATION: PagingConfig = {
  pagesCount: -1,
  perPage: 50,
  currentPage: 1
}

@Component({
  selector: 'episodes-episode-details-modal',
  templateUrl: './episode-details-modal.component.html',
  styleUrls: ['./episode-details-modal.component.scss']
})
export class EpisodeDetailsModalComponent implements OnInit, OnDestroy {
  episodeDetails: EpisodeDisplay;
  total: number;
  winnersData: UserPaymentData[];
  pagesCount: number;
  prizeData: PrizeData;
  tableConfig: TableConfig;
  userPaymentDetailsModalRef: BsModalRef;
  loadDataSubscription: Subscription;
  tableExportSubscription: Subscription;
  lastPagination: PagingConfig;
  lastSort: SortConfig;


  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fetchEpisodesDataService: FetchEpisodesDataService
  ) {
    this.lastSort = {
      order: "",
      orderBy: ""
    }
    this.lastPagination = INITIAL_PAGINATION;
  }

  ngOnInit() {
    this.configureEpisodeWinnersTable();
  }

  /**
   * @desc Makes API call in order to fetch episode winners data with given sort params
   * @param {SortConfig} params Sort params outputed from table when clicked on column header
   * @memberof EpisodeDetailsModalComponent
   */
  sortTable = (params: SortConfig): void => {
    this.lastSort = params;
    this.loadDataSubscription = this.fetchEpisodesDataService
      .fetchEpisodeWinnersData$(
        this.episodeDetails.episodeID,
        params.orderBy,
        params.order,
        this.lastPagination.currentPage,
        this.lastPagination.perPage
      )
      .subscribe(this.handleResponse);
  };

  /**
   * @desc Handles response of sort or new page request by overriding rows data in table config
   * @param {object} response Response winners payment data
   * @memberof EpisodeDetailsModalComponent
   */
  handleResponse = (response: { winners: UserPaymentData[]; prizeData: PrizeData; pagesCount: number; total: number }): void => {
    this.tableConfig.rows = response.winners;
    this.tableConfig.pagination.pagesCount = response.pagesCount;
    this.tableConfig.totalRecordsCount = response.total;
  };

  /**
   * @desc Sets configuration for table in which are displayed results of search for winners (user's payment data) by episode ID
   * @memberof EpisodeDetailsModalComponent
   */
  configureEpisodeWinnersTable = (): void => {
    this.tableConfig = {
      title: 'Episode winners',
      columns: [
        { columnHeader: 'Email', dataKey: 'email', tooltip: true, sort: { orderBy: 'email', order: 'asc' } },
        {
          columnHeader: 'Prize money',
          dataKey: 'prizemoney',
          isCurrency: true,
          sort: { orderBy: 'prizemoney', order: 'asc' }
        },
        {
          columnHeader: 'Payment provider',
          dataKey: 'paymentProvider',
          sort: { orderBy: 'paymentProvider', order: 'asc' }
        },
        {
          columnHeader: 'Payment details',
          dataKey: 'paypalIdentifier',
          dependsOn: {
            dataKey: 'paymentProvider',
            value: 'bank',
            alternativeDataKey: 'bankAccountNumber'
          },
          shouldBeMasked: true,
          tooltip: true,
          sort: { orderBy: 'bankAndPayPal', order: 'asc' }
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
      rows: this.winnersData,
      isClickable: true,
      isScrollable: true,
      maxHeight: 'calc(65vh - 218px)',
      hasNumeration: true,
      shouldExportData: true,
      totalRecordsCount: this.total,
      pagination: {
        ...this.lastPagination,
        pagesCount: this.pagesCount
      }
    };
  }

  onPagingChanged = (pageConfig: PagingConfig): void => {
    this.lastPagination = pageConfig;
    this.loadDataSubscription = this.fetchEpisodesDataService
      .fetchEpisodeWinnersData$(
        this.episodeDetails.episodeID,
        this.lastSort.orderBy,
        this.lastSort.order,
        pageConfig.currentPage,
        pageConfig.perPage
      )
      .subscribe(this.handleResponse);

  }

  /**
   * @desc Opens the modal with user's payment details
   * @param {number} rowIndex Selected row in table with user's payment data
   * @memberof EpisodeDetailsModalComponent
   */
  showWinnersPaymentDetails = (rowData: UserPaymentData): void => {
    this.userPaymentDetailsModalRef = this.modalService.show(
      UserPaymentDetailsModalComponent,
      {
        initialState: {
          episodeDetails: rowData
        }
      }
    );
    const secondPopup = document.querySelectorAll('.modal-dialog')[1] as HTMLElement;
    secondPopup.style.marginTop = '50px';
  };

  /**
   * @desc Initiates API call for creating and storing .xls file with data currently displayed in the table
   * (API call returns url for downloading .xls file report)
   * @param {string} tableTitle Title of the table from which data is extracted
   * @memberof FindUserComponent
   */
  onExportTableData = (tableTitle: string): void => {
    this.tableExportSubscription = this.fetchEpisodesDataService.createTableReport$(
      'getPaymentsByEpisode',
      `${tableTitle} ${this.episodeDetails.episodeID}`
    ).subscribe(this.downloadReport);
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

  ngOnDestroy(): void {
    if (this.loadDataSubscription) {
      this.loadDataSubscription.unsubscribe();
    }
    if (this.tableExportSubscription) {
      this.tableExportSubscription.unsubscribe();
    }
  }
}
