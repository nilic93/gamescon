import { FetchFilterDataService } from './fetch-filter-data.service';
import { of } from 'rxjs';
import { filterMockData } from '../shared/mocks/filter-data-response';

let service: FetchFilterDataService;
const httpMock = {
  get: jest.fn(),
};

beforeEach(() => {
  service = new FetchFilterDataService(httpMock as any);
});

describe('Test FetchEpisodesDataService', () => {
  //
  it('fetchEpisodesData$: should return a list of filtered users', () => {
    httpMock.get.mockImplementationOnce(() => of(filterMockData));
    service.fetchFilterData$({ minEpisodes: 2, maxEpisodes: 2, minAmountWon: 10, maxAmountWon: 15 }).subscribe(response => {
      expect(response).toEqual(filterMockData);
    });
  });
  it('fetchEpisodesData$: should return a list of filtered users', () => {
    httpMock.get.mockImplementationOnce(() => of(filterMockData));
    service.fetchFilterData$({ minEpisodes: 2, maxEpisodes: 2, minAmountWon: 0, maxAmountWon: 0 }).subscribe(response => {
      expect(response).toEqual(filterMockData);
    });
  });
});
