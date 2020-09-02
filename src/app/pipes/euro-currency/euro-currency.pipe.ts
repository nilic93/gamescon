import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

/*
 * Puts euro sign in front of given value if value is number
 *  Usage:
 *   value | euroCurrency
 * Example:
 *   {{ 12.3456 | euroCurrency }}
 *   formats to: €12.34
 */
@Pipe({ name: 'euroCurrency' })
export class EuroCurrencyPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: any): string {
    try {
      return this.currencyPipe.transform(value, 'EUR', 'symbol');
    } catch {
      return value;
    }
  }
}
