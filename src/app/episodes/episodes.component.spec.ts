import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EpisodesComponent } from './episodes.component';
import { FetchEpisodesDataService } from './fetch-episodes-data.service';
import { episodesMock } from '../shared/mocks/all-episodes-response';
import { of } from 'rxjs';
import { EpisodeDisplay } from '../shared/models/episode-display.model';
import { userPaymentDataResponseMock } from '../shared/mocks/user-payment-data-response';

const fetchEpisodesDataServiceStub = {
  fetchData: jest.fn(),
  fetchEpisodesData$: of(episodesMock),
  fetchEpisodeWinnersData$: of(userPaymentDataResponseMock.body),
};

const mockEpisodes: EpisodeDisplay = {
  episodeID: 'S1E1',
  date: '27/11/2011',
  time: '15:08',
  totalAmount: '5000',
  amountPerWinner: 50,
  numberOfWinners: 100
};

const modalServiceMock = {
  show: jest.fn().mockReturnValue(new BsModalRef()),
};

describe('EpisodesComponent', () => {
  let component: EpisodesComponent;
  let fixture: ComponentFixture<EpisodesComponent>;
  let fetchEpisodesDataService: FetchEpisodesDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [EpisodesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FetchEpisodesDataService,
        {
          provide: BsModalService,
          useValue: modalServiceMock
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit() : should create', async(() => {
    expect(component).toBeTruthy();
    expect(component.loadingEpisodes).toBe(true);
    expect(component.fetchDataSubscription.closed).toBe(false);
  }));

  it('handleFetchedData()', () => {
    const configureTableSpy = jest.spyOn(component, 'configureEpisodesOverviewTable');

    component.handleFetchedData(episodesMock);
    expect(component.loadingEpisodes).toEqual(false);
    expect(configureTableSpy).toBeCalledTimes(1);
  });

  it('fetchEpisodeWinners', () => {
    component.shouldFetchWinners = true;
    component.fetchEpisodesDataService.fetchEpisodeWinnersData$(mockEpisodes.episodeID);

    component.fetchEpisodeWinners(mockEpisodes);
  })

  it('fetchEpisodeWinners', () => {
    component.shouldFetchWinners = false;
    component.fetchEpisodeWinners(mockEpisodes);
  })

  it('ngOnDestroy()', () => {
    component.ngOnDestroy();
    expect(component.fetchDataSubscription.closed).toBe(true);
  });
});
