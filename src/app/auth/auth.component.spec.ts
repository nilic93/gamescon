import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { authServiceStub } from '../shared/mocks/auth-service-stub/auth.service.stub';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutes } from '../app.routing';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FindUserComponent } from '../find-user/find-user.component';
import { EpisodesComponent } from '../episodes/episodes.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { FilterComponent } from '../filter/filter.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CustomPaymentComponent } from "../custom-payment/custom-payment.component";
import { PayoutFilesComponent } from '../payout-files/payout-files.component';

describe('LoginFormComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(AppRoutes)],
declarations: [
        AuthComponent,
        DashboardLayoutComponent,
        FindUserComponent,
        EpisodesComponent,
        StatisticsComponent,
        FilterComponent,
        DashboardComponent,
        CustomPaymentComponent,
        PayoutFilesComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
