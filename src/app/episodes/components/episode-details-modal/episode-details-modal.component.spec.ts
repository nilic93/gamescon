import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, Subscription } from 'rxjs';

import { EpisodeDetailsModalComponent } from './episode-details-modal.component';
import { EpisodeDisplay } from '../../../shared/models/episode-display.model';
import { UserPaymentDetailsModalComponent } from '../../../shared/components/user-payment-details-modal/user-payment-details-modal.component';
import { PrizeData } from '../../../shared/models/prize-data.model';
import { UserPaymentData } from '../../../shared/models/user-payment-data.model';
import { episodesMock } from '../../../shared/mocks/all-episodes-response';
import { userPaymentDataResponseMock } from '../../../shared/mocks/user-payment-data-response';

const fetchEpisodesDataServiceStub = {
  fetchEpisodesData$: jest.fn().mockReturnValue(of(episodesMock)),
  fetchEpisodeWinnersData$: jest.fn().mockReturnValue(of(userPaymentDataResponseMock)),
};

describe('EpisodeDetailsModalComponent', () => {
  let modalService: BsModalService | any;
  let modalRef: BsModalRef;
  let component: EpisodeDetailsModalComponent;
  let episodeDetails: EpisodeDisplay;
  let prizeData: PrizeData;
  let winnersData: UserPaymentData[];


  beforeEach(() => {
    modalService = {
      show: jest.fn().mockReturnValue(BsModalRef),
    };
    component = new EpisodeDetailsModalComponent(modalRef, modalService, fetchEpisodesDataServiceStub as any);
    episodeDetails = {
      episodeID: '1',
      date: '01/01/2018',
      time: '00:00',
      totalAmount: '1000',
      amountPerWinner: '10',
      numberOfWinners: '100',
    };

    prizeData = {
      lucky13: {
        amount: '7.0',
        count: 13,
      },
      double13: {
        amount: '14.0',
        count: 26,
      },
    };

    winnersData = [
      {
        email: 'test@email.com',
        prizemoney: '123',
        episode: '3',
        tax: '0.00',
        userID: 'test-user-id',
      },
    ];

    component.episodeDetails = episodeDetails;
    component.prizeData = prizeData;
    component.winnersData = winnersData;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test showWinnersPaymentDetails()', () => {

    let firstPopup = document.createElement("div");
    firstPopup.setAttribute('style', 'margin-top:50px');
    let secondPopup = document.createElement("div");
    secondPopup.setAttribute('style', 'margin-top:25px');
    document.querySelectorAll = jest.fn().mockReturnValue([firstPopup, secondPopup]);

    it('should call show method', () => {
      const selectedRowData = {
        email: 'test@email.com',
        episode: '3',
        prizemoney: '123',
        tax: '0.00',
        userID: 'test-user-id',
      };
      component.showWinnersPaymentDetails(selectedRowData);
      expect(modalService.show).toBeCalledTimes(1);
      expect(secondPopup.style.marginTop).toBe("50px");
      expect(modalService.show).toBeCalledWith(UserPaymentDetailsModalComponent, {
        initialState: {
          episodeDetails: selectedRowData,
        },
      });
    });
  });

  describe('Test configureEpisodeWinnersTable()', () => {
    test('should should set correct object to tableConfig property', () => {
      const testConfig = {
        title: "Episode winners",
        columns: [
          { columnHeader: 'Email', dataKey: 'email', tooltip: true, sort: { orderBy: 'email', order: 'asc' } },
          {
            columnHeader: 'Prize money',
            dataKey: 'prizemoney',
            isCurrency: true,
            sort: { orderBy: 'prizemoney', order: 'asc' },
          },
          {
            columnHeader: 'Payment provider',
            dataKey: 'paymentProvider',
            sort: { orderBy: 'paymentProvider', order: 'asc' },
          },
          {
            columnHeader: 'Payment details',
            dataKey: 'paypalIdentifier',
            dependsOn: {
              dataKey: 'paymentProvider',
              value: 'bank',
              alternativeDataKey: 'bankAccountNumber',
            },
            shouldBeMasked: true,
            tooltip: true,
            sort: { orderBy: 'bankAndPayPal', order: 'asc' },
          },
          {
            columnHeader: 'Status',
            dataKey: 'status',
            colorLabels: [
              {
                color: "green",
                dataValue: "Payment successful",
              },
              {
                color: "blue",
                dataValue: "Prize claimed",
              },
              {
                color: "orange",
                dataValue: "Not claimed",
              },
            ],
          },
        ],
        rows: winnersData,
        isClickable: true,
        isScrollable: true,
        maxHeight: 'calc(65vh - 218px)',
        hasNumeration: true,
        shouldExportData: true,
        pagination: {
          currentPage: 1,
          pagesCount: undefined,
          perPage: 50
        }
      };

      component.configureEpisodeWinnersTable();

      expect(component.tableConfig).toEqual(testConfig);
    });
  });

  describe('Test ngOnInit()', () => {
    test('should configure winners data table', () => {
      const configureTableSpy = jest.spyOn(component, 'configureEpisodeWinnersTable');

      component.ngOnInit();

      expect(configureTableSpy).toBeCalledTimes(1);
    });
  });

  describe('Test handleSortResponse()', () => {
    test('should override rows data in table config', () => {
      component.tableConfig = {
        columns: [{ columnHeader: 'test-col', dataKey: 'key' }],
        rows: [],
        pagination: {
          pagesCount: undefined,
          perPage: 50,
          currentPage: 1
        }
      }
      const newTebleData = [
        {
          test: 'test',
        },
      ];
      const testResponse = { winners: newTebleData, prizeData: {}, pagesCount: 1 };

      component.handleResponse(testResponse);

      expect(component.tableConfig.rows).toEqual(newTebleData);
    });
  });

  describe('ngOnDestroy()', () => {

    test('should do nothing if subscription does not exist', () => {
      component.ngOnDestroy();
      expect(component.loadDataSubscription).toBeUndefined();
    });

    test('should close subscription if exists', () => {
      component.loadDataSubscription = new Subscription();
      const spy = jest.spyOn(component.loadDataSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(spy).toBeCalledTimes(1);
      expect(component.loadDataSubscription.closed).toBe(true);
    });
  });
});