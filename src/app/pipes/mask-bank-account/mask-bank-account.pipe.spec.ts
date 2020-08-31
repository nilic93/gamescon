import { MaskBankAccountPipe } from './mask-bank-account.pipe';

let maskPipe: MaskBankAccountPipe;

beforeEach(() => {
  maskPipe = new MaskBankAccountPipe();
});

describe('Test MaskBankAccountPipe', () => {
  test('should mask only part of the inputed string value that matches to sequence of seven digits \
  if provided value is valid bank account', () => {
    let testString = 'NL28KNAB0204542323';

    const transformed = maskPipe.transform(testString);

    expect(transformed).toEqual('NL28KNAB*******323');
  });

  test('should not mask value if value contains sequence of less than seven digits', () => {
    let testString = 'NL28KNAB02045AAA42323';

    const transformed = maskPipe.transform(testString);

    expect(transformed).toEqual(testString);
  });

  test('should not mask value if is not valid bank account', () => {
    let testString = 'some-invalid-bank-acc';

    const transformed = maskPipe.transform(testString);

    expect(transformed).toEqual(testString);
  })
});
