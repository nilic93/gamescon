import { of } from 'rxjs';

import { episodesMock } from '../shared/mocks/all-episodes-response';
import { byEpisodeResponseMock } from '../shared/mocks/search-by-episode-response';
import { PrizeData } from '../shared/models/prize-data.model';
import { AuthService } from './auth.service';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

let service: AuthService;
const routerMock = {
  navigate: jest.fn(),
};

const config = {
  getCognitoPoolID: jest.fn().mockReturnValue('cognito-pool-id'),
  getCognitoClientID: jest.fn().mockReturnValue('cognito-client-id')
}


describe('Test FetchEpisodesDataService', () => {
  beforeEach(() => {
    service = new AuthService(routerMock as any);
    service.userPool = new CognitoUserPool({
      UserPoolId: 'cognito-pool-id',
      ClientId: 'cognito-client-id'
    });
  });
  test('should instantiate correctly', () => {
    expect(service.userPool).toBeTruthy();
    expect(service.isNewPasswordRequired).toEqual(false);
    expect(service.loading).toEqual(false);
    expect(service.authError).toEqual(null);
  });

});
