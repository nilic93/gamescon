export interface UserProfile {
  email: string;
  wonEpisodesCount: number;
  totalAmountWon: string;
  firstName: string;
  lastName: string;
  createdOn: string;
  photoURL: string;
  profileURL?: string;
  socialProviders?: string[];
  userFoundOnGigya: boolean;
  isMailVerified?: boolean;
  isRegistrationFinalized?: boolean;
}
