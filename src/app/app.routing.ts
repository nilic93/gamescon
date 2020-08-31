import { Routes, PRIMARY_OUTLET } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FindUserComponent } from './find-user/find-user.component';
import { EpisodesComponent } from './episodes/episodes.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FilterComponent } from './filter/filter.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { CustomPaymentComponent } from "./custom-payment/custom-payment.component";
import { PayoutFilesComponent } from './payout-files/payout-files.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    outlet: PRIMARY_OUTLET
  },
  {
    path: 'login',
    component: AuthComponent,
    outlet: PRIMARY_OUTLET
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'findUser',
        component: FindUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'customPayment',
        component: CustomPaymentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'episodes',
        component: EpisodesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'filter',
        component: FilterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payoutFiles',
        component: PayoutFilesComponent,
        canActivate: [AuthGuard]
      },
      // TODO: Uncomment theese objects when implementation of dashboard and statistics pages is needed.

      // {
      //   path: 'statistics',
      //   component: StatisticsComponent,
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'dashboard',
      //   component: DashboardComponent,
      //   canActivate: [AuthGuard]
      // }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
