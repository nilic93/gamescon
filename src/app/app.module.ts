import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import {AppRoutes} from './app.routing';

import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {EpisodesComponent} from './episodes/episodes.component';
import {StatisticsComponent} from './statistics/statistics.component';

import {SidebarModule} from './sidebar/sidebar.module';
import {SharedModule} from './shared/shared.module';
import {FindUserModule} from './find-user/find-user.module';
import {EpisodesModule} from './episodes/episodes.module';
import {FilterModule} from './filter/filter.module';
import {AuthModule} from './auth/auth.module';
import {AuthService} from './auth/auth.service';
import {StorageService} from './storage/storage.service'
import {DashboardLayoutComponent} from './dashboard-layout/dashboard-layout.component';
import {AuthGuard} from './guards/auth/auth.guard';
import {CustomPaymentModule} from './custom-payment/custom-payment.module';
import {PayoutFilesModule} from './payout-files/payout-files.module';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpConfigInterceptor} from './interceptors/httpconfig.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        EpisodesComponent,
        StatisticsComponent,
        DashboardLayoutComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        BrowserModule,
        RouterModule.forRoot(AppRoutes),
        SidebarModule,
        SharedModule,
        CustomPaymentModule,
        FindUserModule,
        EpisodesModule,
        FilterModule,
        AuthModule,
        PayoutFilesModule
    ],
    providers: [AuthService,
        StorageService,
        {provide: APP_BASE_HREF, useValue: '/'},
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
