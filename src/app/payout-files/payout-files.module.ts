import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayoutFilesComponent } from './payout-files.component';
import { DateInputComponent } from './components/date-input/date-input.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        PayoutFilesComponent,
        DateInputComponent
    ],
    exports: [],
})
export class PayoutFilesModule { }
