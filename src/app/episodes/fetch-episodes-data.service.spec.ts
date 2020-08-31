import { of } from 'rxjs';

import { FetchEpisodesDataService } from './fetch-episodes-data.service';
import { episodesMock } from '../shared/mocks/all-episodes-response';
import { byEpisodeResponseMock } from '../shared/mocks/search-by-episode-response';
import { PrizeData } from '../shared/models/prize-data.model';

let service: FetchEpisodesDataService;
const httpMock = {
  get: jest.fn(),
};

beforeEach(() => {
  service = new FetchEpisodesDataService(httpMock as any);
});

describe('Test FetchEpisodesDataService', () => {
  test('fetchEpisodesData$: should return a list of episodes data', () => {
    const url = `test.com`;
    httpMock.get.mockImplementationOnce(() => of(episodesMock));
    service.fetchEpisodesData$().subscribe(response => {
      expect(httpMock.get).toBeCalledWith(url);
      expect(response).toEqual(episodesMock);
    });
  });

  test('fetchEpisodeWinnersData$: should return a list of winners', () => {
    const url = `test.com`;
    httpMock.get.mockImplementationOnce(() => of(byEpisodeResponseMock));
    service.fetchEpisodeWinnersData$('S1E85').subscribe(response => {
      expect(httpMock.get).toBeCalledWith(url);
      expect(response).toEqual(byEpisodeResponseMock);
    });
  });

  describe('Test extractPrizeData()', () => {
    let expectedReturn: PrizeData = {
      lucky13: {
        amount: '7.02',
        count: 2,
      },
      double13: {
        amount: '17.02',
        count: 1,
      },
    };

    it('should return correct PrizeData object if not passed empty array and first item has lucky13 win', () => {
      const prizeData = service.extractPrizeData(byEpisodeResponseMock.body);
      expect(prizeData).toEqual(expectedReturn);
    });

    it('should return default if passed empty array', () => {
      const defaultReturn = {
        lucky13: {
          amount: '0.00',
          count: 0,
        },
        double13: {
          amount: '0.00',
          count: 0,
        },
      };
      const prizeData = service.extractPrizeData([]);
      expect(prizeData).toEqual(defaultReturn);
    });

    it('should return correct PrizeData object if not passed empty array and first item has double13 win', () => {
      const modified = byEpisodeResponseMock.body.slice();
      modified[0].prizemoney = '17.02';
      modified[1].prizemoney = '7.02';
      const prizeData = service.extractPrizeData(modified);
      expect(prizeData).toEqual(expectedReturn);
    });

    it('should return correct PrizeData object there are no double13 winners', () => {
      const noDouble13 = {
        lucky13: {
          amount: '7.02',
          count: 3,
        },
        double13: {
          amount: '0.00',
          count: 0,
        },
      };
      const modified = byEpisodeResponseMock.body.slice();
      modified[0].prizemoney = '7.02';
      const prizeData = service.extractPrizeData(modified);
      expect(prizeData).toEqual(noDouble13);
    });
  });

  describe('extractPrizeData()', () => {
    it('should return object with basic data and calculated amount per winner and winners count if gets appropriate data in argument', () => {
      const episodesData = service.extractEpisodeData([episodesMock[0]]);
      expect(episodesData).toEqual([
        {
          episodeID: 'S1E1',
          date: '17/09/2018',
          time: '18:44 - 19:01',
          totalAmount: '€2000',
          amountPerWinner: '€2.84',
          numberOfWinners: '704',
        },
      ]);
    });

    it('should return object with total amount and other basic data \
        except per winner and winners count if not provided appropriate data in settings', () => {
      const episodesData = service.extractEpisodeData([episodesMock[1]]);
      expect(episodesData).toEqual([
        {
          episodeID: 'S1E2',
          date: '11/06/2018',
          time: '18:56 - 19:16',
          totalAmount: '€1000',
          amountPerWinner: '/',
          numberOfWinners: '/',
        },
      ]);
    });

    it('should return object without total amount and with other basic data \
        except per winner and winners count if not provided appropriate data in settings', () => {
      const episodesData = service.extractEpisodeData([episodesMock[2]]);
      expect(episodesData).toEqual([
        {
          episodeID: 'S1E3',
          date: '11/06/2018',
          time: '19:17 - 19:36',
          totalAmount: '/',
          amountPerWinner: '/',
          numberOfWinners: '/',
        },
      ]);
    });
  });

  describe('Test extractTotalAmount()', () => {

    it('should return TotalAmount = 2000', () => {
      let array = [
        {
          "key": "episode_number",
          "values": {
            "all": "109"
          }
        },
        {
          "key": "number",
          "values": {
            "all": 2000
          }
        },
        {
          "key": "winner_prize",
          "values": {
            "all": 9.52
          }
        },
        {
          "key": "sent_payout",
          "values": {
            "all": true
          }
        }
      ];
      const totalAmount = service.extractFrom(array, 'number');
      expect(totalAmount).toEqual(2000);
    });

    it('should return TotalAmount = NaN', () => {
      let array = [
        {
          "key": "episode_number",
          "values": {
            "all": "109"
          }
        },
        {
          "key": "winner_prize",
          "values": {
            "all": 9.52
          }
        },
        {
          "key": "sent_payout",
          "values": {
            "all": true
          }
        }
      ];
      const totalAmount = service.extractFrom(array, 'number');
      expect(totalAmount).toEqual(NaN);
    });
  });

  describe('Test amountPerWinner()', () => {

    it('should return amountPerWinner = 9.52', () => {
      let array = [
        {
          "key": "episode_number",
          "values": {
            "all": "109"
          }
        },
        {
          "key": "number",
          "values": {
            "all": 2000
          }
        },
        {
          "key": "winner_prize",
          "values": {
            "all": 9.52
          }
        },
        {
          "key": "sent_payout",
          "values": {
            "all": true
          }
        }
      ];
      const perWinner = service.extractFrom(array, 'winner_prize');
      expect(perWinner).toEqual(9.52);
    });

    it('should return amountPerWinner = NaN', () => {
      let array = [
        {
          "key": "episode_number",
          "values": {
            "all": "109"
          }
        },
        {
          "key": "number",
          "values": {
            "all": 2000
          }
        },
        {
          "key": "sent_payout",
          "values": {
            "all": true
          }
        }
      ];
      const perWinner = service.extractFrom(array,'winner_prize');
      expect(perWinner).toEqual(NaN);
    });

    it('should return amountPerWinner = NaN', () => {
      let array = [
        {
          "key": "episode_number",
          "values": {
            "all": "109"
          }
        },
        {
          "key": "number",
          "values": {
            "all": 2000
          }
        },
        {
          "key": "winner_prize",
          "values": {
            "all": null
          }
        },
        {
          "key": "sent_payout",
          "values": {
            "all": true
          }
        }
      ];
      const perWinner = service.extractFrom(array, 'winner_prize');
      expect(perWinner).toEqual(NaN);
    });
  });

  describe( 'Should test numberOfWinners()', ()=> {

    it ('should return 2 winners' , () => {
      const winners = service.numberOfWinners(4,2);
      expect(winners).toEqual(2)
    })

    it ('should return 2 winners' , () => {
      const winners = service.numberOfWinners(5,2);
      expect(winners).toEqual(2.5)
    })

    it ('should return NaN' , () => {
      const winners = service.numberOfWinners('dkljf',2);
      expect(winners).toEqual(NaN)
    })

    it ('should return NaN' , () => {
      const winners = service.numberOfWinners(4,'hgkdg');
      expect(winners).toEqual(NaN)
    })

    it ('should return NaN' , () => {
      const winners = service.numberOfWinners('dkljf',2);
      expect(winners).toEqual(NaN)
    })

    it ('should return NaN' , () => {
      const winners = service.numberOfWinners(4,'hgkdg');
      expect(winners).toEqual(NaN)
    })

    it ('should return NaN' , () => {
      const winners = service.numberOfWinners(NaN,2);
      expect(winners).toEqual(NaN)
    })

    it ('should return NaN' , () => {
      const winners = service.numberOfWinners(NaN,'hgkdg');
      expect(winners).toEqual(NaN)
    })

    it ('should return NaN' , () => {
      const winners = service.numberOfWinners(NaN,NaN);
      expect(winners).toEqual(NaN)
    })

  })
});
