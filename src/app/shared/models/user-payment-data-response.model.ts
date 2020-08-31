import { UserPaymentData } from "./user-payment-data.model";

export interface UserPaymentDataResponse {
  statusCode: number;
  body: UserPaymentData[];
  input: {
    userEmail: string;
  };
  pagesCount: number;
  headers: object;
  total: number;
}
