import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';
import { TableComponent } from './components/table/table.component';
import { PipesModule } from '../pipes/pipes.module';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';

@NgModule({
    imports: [ RouterModule, CommonModule, PipesModule],
    declarations: [ NavbarComponent, TableComponent, LoaderComponent, NotificationCardComponent ],
    exports: [ NavbarComponent, TableComponent, LoaderComponent, NotificationCardComponent ],
    entryComponents: []
})

export class SharedModule {}
