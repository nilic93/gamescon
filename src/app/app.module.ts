import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import {AppRoutes} from './app.routing';

import {AppComponent} from './app.component';

import {SidebarModule} from './sidebar/sidebar.module';
import {SharedModule} from './shared/shared.module';
import {TetrisModule} from './tetris/tetris.module';
import {AuthModule} from './auth/auth.module';
import {AuthService} from './auth/auth.service';
import {StorageService} from './storage/storage.service'
import {DashboardLayoutComponent} from './dashboard-layout/dashboard-layout.component';
import {AuthGuard} from './guards/auth/auth.guard';
import {CustomPaymentModule} from './custom-payment/custom-payment.module';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpConfigInterceptor} from './interceptors/httpconfig.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
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
        TetrisModule,
        AuthModule,
    ],
    providers: [AuthService,
        StorageService,
        {provide: APP_BASE_HREF, useValue: '/'},
        AuthGuard,
        {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
