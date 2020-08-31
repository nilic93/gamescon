import { UserPaymentData } from '../models/user-payment-data.model';

export const byEpisodeResponseMock: { body: UserPaymentData[] } = {
  body: [
    {
      payoutProcessedIn: 'lucky13_paypal_import_20180613085255.csv',
      paymentProvider: 'paypal',
      bankAccountName: null,
      userID: 'S2E1_n00326f074c84ef78e87a6ce0c21aa08',
      paypalIdentifier: 'user22_test@gmail.com',
      episode: 'S2E1',
      tax: '0.00',
      payoutProcessed: 1,
      bankAccountNumber: null,
      email: 'user22_test@gmail.com',
      prizemoney: '7.02',
    },
    {
      payoutProcessedIn: 'lucky13_paypal_import_20180613085255.csv',
      paymentProvider: 'paypal',
      bankAccountName: null,
      userID: 'S2E1_p00326f074c84ef78e87a6ce0c21aa08',
      paypalIdentifier: 'user33_test@gmail.com',
      episode: 'S2E1',
      tax: '0.00',
      payoutProcessed: 1,
      bankAccountNumber: null,
      email: 'user33_test@gmail.com',
      prizemoney: '17.02',
    },
    {
      payoutProcessedIn: 'lucky13_paypal_import_20180613085255.csv',
      paymentProvider: 'paypal',
      bankAccountName: null,
      userID: 'S2E1_m00326f074c84ef78e87a6ce0c21aa08',
      paypalIdentifier: 'user1_test@gmail.com',
      episode: 'S2E1',
      tax: '0.00',
      payoutProcessed: 1,
      bankAccountNumber: null,
      email: 'user1_test@gmail.com',
      prizemoney: '7.02',
    },
  ],
};
