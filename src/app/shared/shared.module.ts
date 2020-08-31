import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';
import { UserPaymentDetailsModalComponent } from './components/user-payment-details-modal/user-payment-details-modal.component';
import { TableComponent } from './components/table/table.component';
import { PipesModule } from '../pipes/pipes.module';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';

@NgModule({
    imports: [ RouterModule, CommonModule, PipesModule],
    declarations: [ NavbarComponent, UserPaymentDetailsModalComponent, TableComponent, LoaderComponent, NotificationCardComponent ],
    exports: [ NavbarComponent, TableComponent, LoaderComponent, NotificationCardComponent ],
    entryComponents: [UserPaymentDetailsModalComponent]
})

export class SharedModule {}
