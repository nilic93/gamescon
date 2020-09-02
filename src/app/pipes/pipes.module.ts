import { NgModule } from '@angular/core';

import { MaskBankAccountPipe } from './mask-bank-account/mask-bank-account.pipe';
import { EuroCurrencyPipe } from './euro-currency/euro-currency.pipe';
import { GameFormatPipe } from './game-format/game-format.pipe';
import { CurrencyPipe, TitleCasePipe, DecimalPipe } from "@angular/common";
import { ThousandSeparatorPipe } from './thousand-separator/thousand-separator.pipe';

@NgModule({
  declarations: [
    MaskBankAccountPipe,
    EuroCurrencyPipe,
    GameFormatPipe,
    ThousandSeparatorPipe
  ],
  imports: [],
  providers: [
    CurrencyPipe,
    TitleCasePipe,
    DecimalPipe
  ],
  exports: [
    MaskBankAccountPipe,
    EuroCurrencyPipe,
    GameFormatPipe,
    ThousandSeparatorPipe
  ]
})
export class PipesModule {
}
