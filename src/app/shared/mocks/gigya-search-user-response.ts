import { GigyaSearchResponse } from "../models/gigya-serch-response.model";

export const defaultGigyaResponseMock: GigyaSearchResponse = {
  statusCode: 200,
  body: {},
  input: {
    userEmail: 'test@test.com',
  },
  headers: {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
};