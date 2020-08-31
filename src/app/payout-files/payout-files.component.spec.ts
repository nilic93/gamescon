import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutFilesComponent } from './payout-files.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PayoutFilesDataService } from './payout-files.service';
import { HttpClient } from '@angular/common/http';

describe('PayoutFilesComponent', () => {
  let component: PayoutFilesComponent;
  let fixture: ComponentFixture<PayoutFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutFilesComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: PayoutFilesDataService,
          useValue: {},
        },
        {
          provide: HttpClient,
          useValue: {},
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
