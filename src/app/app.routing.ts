import { Routes, PRIMARY_OUTLET } from '@angular/router';
import { TetrisComponent } from './tetris/tetris.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { CustomPaymentComponent } from './custom-payment/custom-payment.component';

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
        path: 'customPayment',
        component: CustomPaymentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tetris',
        component: TetrisComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
