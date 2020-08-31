import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { AppRoutes } from './../app.routing';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { AuthComponent } from '../auth/auth.component';
import { FindUserComponent } from '../find-user/find-user.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { EpisodesComponent } from '../episodes/episodes.component';
import { FilterComponent } from '../filter/filter.component';
import { CustomPaymentComponent } from "../custom-payment/custom-payment.component";
import { PayoutFilesComponent } from '../payout-files/payout-files.component';

describe('DashboardLayoutComponent', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(AppRoutes)],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        DashboardLayoutComponent,
        AuthComponent,
        FindUserComponent,
        DashboardComponent,
        StatisticsComponent,
        EpisodesComponent,
        FilterComponent,
        CustomPaymentComponent,
        PayoutFilesComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
