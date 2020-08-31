import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FetchFilterDataService } from './fetch-filter-data.service';
import { FilterDataResponse } from './../shared/models/filter-data-response';
import { FilterData } from '../shared/models/filter-data.model';
import { TableConfig, SortConfig } from '../shared/models/table-config.model';
import { FilterParams } from '../shared/models/filter-params.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [FetchFilterDataService],
})
export class FilterComponent implements OnInit, OnDestroy {
  loading: boolean;
  filterResultsTableConfig: TableConfig;
  loadDataSubscription: Subscription;
  tableExportSubscription: Subscription;
  lastFilterParams: FilterParams;

  constructor(public service: FetchFilterDataService) {
    this.loading = false;
  }

  ngOnInit() {
  }

  /**
   * @desc onParamsInputed() triggers on "Start search" button on filter page
   * @param {Object} params - Params for filtering data
   * @param {number} params.minEpisodes Minimum won episodes
   * @param {number} params.maxEpisodes Maximum won episodes
   * @param {string} params.minPrize Minimum summarized prize won
   * @param {string} params.maxPrize Maximum summarized prize won
   * @memberof FilterComponent
   */
  onParamsInputed = (params: FilterParams) => {
    this.loading = true;
    this.lastFilterParams = params;
    this.loadDataSubscription = this.service.fetchFilterData$(params).subscribe(this.handleFilterResponse);
  };

  /**
   * @desc Calls configureFilterResultsTable and sets loading to false, because fetching from DB is finished
   * @param {FilterDataResponse} response object that comes from API as a result of filtering
   * @memberof FilterComponent
   */
  handleFilterResponse = (response: FilterDataResponse) => {
    this.configureFilterResultsTable(response);
    this.loading = false;
  };

  /**
   * @desc Sets configuration for table in which are displayed results of filtering
   * @param {FilterData[]} tableData Array of objects that comes from API as a result of filtering
   * @memberof FilterComponent
   */
  configureFilterResultsTable = (response: FilterDataResponse) => {
    this.filterResultsTableConfig = {
      title: 'Filter overview',
      columns: [
        { columnHeader: 'Mailaddress', dataKey: 'key', tooltip: true, sort: { orderBy: 'email', order: 'asc' } },
        {
          columnHeader: 'Total won episodes',
          dataKey: 'doc_count',
          sort: { orderBy: 'totalWonEpisodes', order: 'asc' },
        },
        {
          columnHeader: 'Total prizemoney',
          dataKey: 'wonInTotal',
          isCurrency: true,
          sort: { orderBy: 'totalPrizemoney', order: 'asc' },
        },
      ],
      rows: response.body,
      isScrollable: true,
      maxHeight: 'calc(100vh - 405px)',
      hasNumeration: true,
      shouldExportData: true,
      totalRecordsCount: response.total
    };
  };

  /**
   * @desc Makes API call in order to fetch sorted filtered data by given criteria
   * @param {SortConfig} params Sort params that defines sort criteria
   * @memberof FilterComponent
   */
  sortTable = (params: SortConfig): void => {
    this.loadDataSubscription = this.service.fetchFilterData$({ ...params, ...this.lastFilterParams }).subscribe(this.handleFilterResponse)
  };

  /**
   * @desc Initiates API call for creating and storing .xls file with data currently displayed in the table
   * (API call returns url for downloading .xls file report)
   * @param {string} tableTitle Title of the table from which data is extracted
   * @memberof FindUserComponent
   */
  onExportTableData = (tableTitle: string): void => {
    this.tableExportSubscription = this.service.createTableReport$('getFilteredData', tableTitle).subscribe(this.downloadReport);
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
   * @desc Clears subscription when component is about to be destroyed
   * @memberof EpisodesComponent
   */
  ngOnDestroy() {
    if (this.loadDataSubscription) {
      this.loadDataSubscription.unsubscribe();
    }
    if (this.tableExportSubscription) {
      this.tableExportSubscription.unsubscribe();
    }
  }
}
