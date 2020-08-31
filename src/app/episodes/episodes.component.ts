import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {FetchEpisodesDataService} from '../episodes/fetch-episodes-data.service';
import {EpisodeDisplay} from '../shared/models/episode-display.model';
import {TableConfig} from '../shared/models/table-config.model';
import {EpisodeDetailsModalComponent} from './components/episode-details-modal/episode-details-modal.component';
import {UserPaymentData} from '../shared/models/user-payment-data.model';
import {PrizeData} from '../shared/models/prize-data.model';


@Component({
    selector: 'episodes-cmp',
    moduleId: module.id,
    templateUrl: 'episodes.component.html'
})
export class EpisodesComponent implements OnInit, OnDestroy {
    fetchDataSubscription: Subscription;
    tableExportSubscription: Subscription;
    loadDataSubscription: Subscription;
    loadingEpisodes: boolean;
    episodesOverviewTableConfig: TableConfig;
    bsModalRef: BsModalRef;
    shouldFetchWinners: boolean;

    constructor(public fetchEpisodesDataService: FetchEpisodesDataService, private modalService: BsModalService) {
        this.loadingEpisodes = true;
        this.shouldFetchWinners = true;
    }

    /**
     * @desc Stores recieved data from Observable in in tableConfig property
     * @param {array} data Recieved data from service
     * @memberof EpisodesComponent
     */
    handleFetchedData = (response): void => {
        this.configureEpisodesOverviewTable(response);
        this.loadingEpisodes = false;
    };

    /**
     * @desc Sets configuration for table in which are displayed results of request for all episodes
     * @param {EpisodeDisplay[]} tableData Array of objects that comes from API as a result of request for all episodes
     * @memberof EpisodesComponent
     */
    configureEpisodesOverviewTable = (response): void => {
        this.episodesOverviewTableConfig = {
            title: 'All episodes overview',
            columns: [
                {columnHeader: 'Episode ID', dataKey: 'episodeID'},
                {columnHeader: 'Date', dataKey: 'date'},
                {columnHeader: 'Time', dataKey: 'time'},
                {columnHeader: 'Total amount', dataKey: 'totalAmount'},
                {columnHeader: 'Amount per winner', dataKey: 'amountPerWinner'},
                {columnHeader: 'Number of winners', dataKey: 'numberOfWinners'}
            ],
            rows: response.body,
            isClickable: true,
            isScrollable: true,
            maxHeight: 'calc(100vh - 210px)',
            shouldExportData: true,
            totalRecordsCount: response.total
        };
    }

    /**
     * @desc Makes API call in order to fetch episode winners data
     * @param { EpisodeDisplay } rowIndex Index of selected episode in episodes overview table
     * @memberof EpisodesComponent
     */
    fetchEpisodeWinners = (rowData: EpisodeDisplay): void => {
        if (this.shouldFetchWinners) {
            this.shouldFetchWinners = false;
            this.loadDataSubscription = this.fetchEpisodesDataService
                .fetchEpisodeWinnersData$(rowData.episodeID)
                .subscribe((response: { winners: UserPaymentData[]; prizeData: PrizeData; pagesCount: number }) => {
                    const modalData = {...response, episodeDetails: rowData};
                    this.showModal(modalData);
                    this.shouldFetchWinners = true;
                });
        }
    };

    /**
     * @desc Opens the modal dialog that displays passed data
     * @param {object} modalData Data to display in modal
     * @memberof EpisodesComponent
     */
    showModal = (modalData): void => {
        this.bsModalRef = this.modalService.show(EpisodeDetailsModalComponent, {
            initialState: {
                winnersData: modalData.winners,
                prizeData: modalData.prizeData,
                episodeDetails: modalData.episodeDetails,
                pagesCount: modalData.pagesCount,
                total: modalData.total
            },
        });
    }

    /**
     * @desc Subscribes to fetchedData$ observable and calls function fetchData in order to make API call
     * @memberof EpisodesComponent
     */
    ngOnInit(): void {
        this.fetchDataSubscription = this.fetchEpisodesDataService.fetchEpisodesData$().subscribe(this.handleFetchedData);
    }

    /**
     * @desc Initiates API call for creating and storing .xls file with data currently displayed in the table
     * (API call returns url for downloading .xls file report)
     * @param {string} tableTitle Title of the table from which data is extracted
     * @memberof FindUserComponent
     */
    onExportTableData = (tableTitle: string): void => {
        this.tableExportSubscription = this.fetchEpisodesDataService.createTableReport$('getAllEpisodes', tableTitle).subscribe(this.downloadReport);
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
    ngOnDestroy(): void {
        this.fetchDataSubscription.unsubscribe();
        if (this.loadDataSubscription) {
            this.loadDataSubscription.unsubscribe();
        }
        if (this.tableExportSubscription) {
            this.tableExportSubscription.unsubscribe();
        }
    }
}
