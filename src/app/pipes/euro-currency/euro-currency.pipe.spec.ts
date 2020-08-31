import { EuroCurrencyPipe } from './euro-currency.pipe';
import { CurrencyPipe } from '@angular/common';

const currencyPipe = new CurrencyPipe('en-US');

let euroCurrencyPipeInstance: EuroCurrencyPipe;
let currencyPipeTransformSpy;
beforeEach(() => {
  euroCurrencyPipeInstance = new EuroCurrencyPipe(currencyPipe);
  currencyPipeTransformSpy = jest.spyOn(currencyPipe, 'transform');
});

describe('Test EuroCurrencyPipe', () => {
  test('should put euro sign in front of given value and round it on two decimals if given numeric value', () => {
    const testValue = '12.344567';

    const transformedValue = euroCurrencyPipeInstance.transform(testValue);

    expect(currencyPipeTransformSpy).toBeCalledTimes(1);
    expect(currencyPipeTransformSpy).toBeCalledWith(testValue, 'EUR', 'symbol');
    expect(transformedValue).toEqual('€12.34');
  });

  test('should not transform if not given numeric value', () => {
    const testValue = 'not-number';
    currencyPipeTransformSpy.mockClear();

    const transformedValue = euroCurrencyPipeInstance.transform(testValue);

    expect(currencyPipeTransformSpy).toBeCalledTimes(1);
    expect(currencyPipeTransformSpy).toBeCalledWith(testValue, 'EUR', 'symbol');
    expect(transformedValue).toEqual('not-number');
  });
});
