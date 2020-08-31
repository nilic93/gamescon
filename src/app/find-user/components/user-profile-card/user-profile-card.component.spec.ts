import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { UserProfileCardComponent } from './user-profile-card.component';
import { FindUserModule } from './../../find-user.module';

describe('UserProfileCardComponent', () => {
  let component: UserProfileCardComponent;
  let fixture: ComponentFixture<UserProfileCardComponent>;
  let template: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FindUserModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileCardComponent);
    component = fixture.componentInstance;
    template = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.profile).toEqual({
      createdOn: '',
      email: '',
      firstName: '',
      lastName: '',
      photoURL: '',
      profileURL: '',
      socialProviders: [],
      totalAmountWon: '0.00',
      userFoundOnGigya: false,
      wonEpisodesCount: -1,
    });
  });

  it('should not render card title (h4) i.e. user name if user not found on Gigya', () => {
    component.profile.userFoundOnGigya = false;
    fixture.detectChanges();

    expect(template.querySelector('.title')).toBeFalsy();
  });

  it('should render "Anonymous Gameroom player" if user not registred via Facebook i.e. profile object has \
     falsy values for firstName and lastName', () => {
    component.profile.userFoundOnGigya = true;
    component.profile.firstName = '';
    component.profile.lastName = '';

    fixture.detectChanges();

    expect(template.querySelector('.title').textContent).toBe(' Anonymous Gameroom player ');
  });

  it('should render first name and last name in card title if user found on Gigya', () => {
    component.profile.firstName = 'first-name';
    component.profile.lastName = 'last-name';
    component.profile.userFoundOnGigya = true;

    fixture.detectChanges();

    expect(template.querySelector('.title').textContent).toBe(' first-name last-name ');
  });

  it('should display facebook and mail icon if user has "facebook" and "site" in socialProviders property', () => {
    component.profile.userFoundOnGigya = true;
    component.profile.socialProviders = ['site', 'facebook'];

    fixture.detectChanges();

    expect(template.querySelector('.login-providers__fb-icon')).toBeTruthy();
    expect(template.querySelector('.login-providers__mail-icon')).toBeTruthy();
    expect(template.querySelector('.login-providers__text--warning')).toBeFalsy();
  });

  it('should display only mail icon if user has not "facebook" and has "site" in socialProviders property', () => {
    component.profile.userFoundOnGigya = true;
    component.profile.socialProviders = ['site'];

    fixture.detectChanges();

    expect(template.querySelector('.login-providers__fb-icon')).toBeFalsy();
    expect(template.querySelector('.login-providers__mail-icon')).toBeTruthy();
    expect(template.querySelector('.login-providers__text--warning')).toBeFalsy();
  });

  it('should only display facebook icon and warning text if user has not "site" and has "facebook" in socialProviders property', () => {
    component.profile.userFoundOnGigya = true;
    component.profile.socialProviders = ['facebook'];

    fixture.detectChanges();

    expect(template.querySelector('.login-providers__fb-icon')).toBeTruthy();
    expect(template.querySelector('.login-providers__mail-icon')).toBeFalsy();
    expect(template.querySelector('.login-providers__text--warning')).toBeTruthy();
  });

  it('should only display facebook icon and warning text if user has not "site" and has "facebook" in socialProviders property', () => {
    component.profile.userFoundOnGigya = true;
    component.profile.socialProviders = ['facebook'];

    fixture.detectChanges();

    expect(template.querySelector('.login-providers__fb-icon')).toBeTruthy();
    expect(template.querySelector('.login-providers__mail-icon')).toBeFalsy();
    expect(template.querySelector('.login-providers__text--warning')).toBeTruthy();
    expect(template.querySelector('.login-providers__text--warning').textContent).toEqual(' (not completed profile) ');
  });

  it('should call showUsersFacebookProfile() on facebook icon click', async(() => {
    component.profile.userFoundOnGigya = true;
    component.profile.socialProviders = ['facebook'];

    fixture.detectChanges();

    const clickSpy = jest.spyOn(component, 'showUsersFacebookProfile');
    const fbIcon = template.querySelector('.login-providers__fb-icon');
    fbIcon.click();

    fixture.whenStable().then(() => {
        expect(clickSpy).toBeCalledTimes(1);
    });
  }));

  it('should call sendEmail() on mail icon click', async(() => {
    component.profile.userFoundOnGigya = true;
    component.profile.socialProviders = ['site'];
    fixture.detectChanges();
    const clickSpy = jest.spyOn(component, 'sendEmail');
    const mailIcon = template.querySelector('.login-providers__mail-icon');
    mailIcon.click();

    fixture.whenStable().then(() => {
        expect(clickSpy).toBeCalledTimes(1);
    });
  }));

  describe('Test showUsersFacebookProfile()', () => {
    it('should call window.open if user profile contains profileURL', () => {
      const windowOpenSpy = jest.spyOn(window, 'open');
      const url = 'http://test.com';
      component.profile.profileURL = url;

      fixture.detectChanges();
      component.showUsersFacebookProfile();

      expect(windowOpenSpy).toBeCalledTimes(1);
      expect(windowOpenSpy).toBeCalledWith(url, 'Popup', 'location,status,scrollbars,resizable');
    })

  })

});
