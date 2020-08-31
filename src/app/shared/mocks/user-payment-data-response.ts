import { UserPaymentDataResponse } from '../models/user-payment-data-response.model';
import { byEpisodeResponseMock } from './search-by-episode-response';

export const userPaymentDataResponseMock: UserPaymentDataResponse = {
  statusCode: 200,
  body: [
    {
      episode: 'S1E85',
      tax: '0.00',
      email: 'test@test.com',
      reminderSend: true,
      userID: 'S1E85_09efb07f72b4f690fb9a0f8df36db89e',
      prizemoney: '2.38',
    },
    {
      episode: 'S1E5',
      tax: '0.00',
      email: 'test@test.com',
      userID: 'S1E5_13cd26f074c84ef78e87a6ce0c21aa08',
      prizemoney: '1.91',
    },
    {
      payoutProcessedIn: 'lucky13_paypal_import_20180613085255.csv',
      paymentProvider: 'paypal',
      bankAccountName: null,
      userID: 'S1E1_03cd26f074c84ef78e87a6ce0c21aa08',
      paypalIdentifier: 'test@test.com',
      episode: 'S1E1',
      tax: '0.00',
      payoutProcessed: 1,
      bankAccountNumber: null,
      email: 'test@test.com',
      prizemoney: '7.02',
    },
  ],
  pagesCount: 1,
  total: 123,
  input: {
    userEmail: 'test@test.com',
  },
  headers: {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
};
