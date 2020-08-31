import { validateBankAcc } from './validate-bank-account';

  describe('Test validateBankAcc()', () => {
    it('Should return true if bank account number is valid', () => {
      const returnValue = validateBankAcc('NL98KNAB0204542332');
      expect(returnValue).toBeTruthy();
    });

    it('Should return false if bank account number is invalid', () => {
      const returnValue = validateBankAcc('NL98K');
      expect(returnValue).toBeFalsy();
    });
  })
