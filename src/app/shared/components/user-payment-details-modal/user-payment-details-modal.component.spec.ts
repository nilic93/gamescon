import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { UserPaymentDetailsModalComponent } from './user-payment-details-modal.component';
import { UserPaymentData } from '../../models/user-payment-data.model';

describe('UserPaymentDetailsModalComponent', () => {
  let component: UserPaymentDetailsModalComponent;
  let fixture: ComponentFixture<UserPaymentDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPaymentDetailsModalComponent],
      providers: [BsModalRef],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentDetailsModalComponent);
    component = fixture.componentInstance;
    const episodeDetails: UserPaymentData = {
      email: 'test@test.com',
      episode: 'S1E1',
      prizemoney: '10.00',
      tax: '0.00',
      userID: 'testID'
    }
    component.episodeDetails = episodeDetails;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('extractPaymentDate()', () => {
    it('should return "05-07-2018"', () => {
      const processFileName = 'lucky13_iban_import_20180705100034.xml';
      const returnValue = component.extractPaymentDate(processFileName);
      expect(returnValue).toBe("05-07-2018");
    })

    it('should return "/"', () => {
      const processFileName = '';
      const returnValue = component.extractPaymentDate(processFileName);
      expect(returnValue).toBe("/");
    })
  })
});
