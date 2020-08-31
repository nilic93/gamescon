import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/*
 * Always uses dot as thousand separator. Built on DecimalPipe
 *  Usage:
 *   value | thousandSeparator
 * Example:
 *   {{ 123456 | thousandSeparator }}
 *   formats to: 123.456
 */
@Pipe({ name: 'thousandSeparator' })
export class ThousandSeparatorPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: any): string {
    try {
      return this.decimalPipe.transform(value, '', 'en-US').replace(',', '.');
    } catch {
      return value;
    }
  }
}
