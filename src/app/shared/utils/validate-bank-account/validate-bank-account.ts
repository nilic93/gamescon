  /**
   * @desc This method checks Bank account number
   * @param account
   * @returns boolean
   */
export const validateBankAcc = (accountNumber) => {
    if (accountNumber) {
      var regex = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/i;
      return regex.test(accountNumber);
    }
  }
