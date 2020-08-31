import { Component, Input } from '@angular/core';

import { UserProfile } from '../../../shared/models/user-profile.model';

declare var window;

@Component({
  selector: 'user-profile-card-cmp',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
  @Input() profile: UserProfile;

  constructor() {
    this.profile = {
      email: '',
      wonEpisodesCount: -1,
      totalAmountWon: '0.00',
      createdOn: '',
      firstName: '',
      lastName: '',
      photoURL: '',
      profileURL: '',
      socialProviders: [],
      userFoundOnGigya: false,
    };
  }

  /**
   * @desc Opens new browser window with users facebook profile page
   * @memberof UserProfileCardComponent
   */
  showUsersFacebookProfile = (): void => {
    if (this.profile.profileURL) {
      window.open(this.profile.profileURL, 'Popup', 'location,status,scrollbars,resizable');
    }
  };

  /**
   * @desc Opens system default mail client with pre-filled "To" field on new mail window
   * @memberof UserProfileCardComponent
   */
  sendEmail = (): void => {
    const link = 'mailto:' + this.profile.email;
    window.location.href = link;
  };
}
