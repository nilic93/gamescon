export interface GigyaSearchResponse {
  statusCode: number;
  body: {
    firstName?: string;
    lastName?: string;
    photoURL?: string;
    createdOn?: string;
    isMailVerified?: boolean;
    isRegistrationFinalized?: boolean;
    socialProviders?: string[];
    profileURL?: string;
  };
  input: {
    userEmail: string;
  };
  headers: object;
}
