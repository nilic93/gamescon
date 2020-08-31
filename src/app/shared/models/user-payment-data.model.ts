export interface UserPaymentData {
  email: string;
  episode: string;
  prizemoney: string;
  tax: string;
  userID: string;
  reminderSend?: boolean;
  bankAccountName?: string;
  bankAccountNumber?: string;
  paymentProvider?: string;
  payoutProcessed?: number;
  payoutProcessedIn?: string;
  paypalIdentifier?: string;
  status?: string;
}
