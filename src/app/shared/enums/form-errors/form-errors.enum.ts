export enum FormErrors {
  PASSWORD_REQUIRED = 'Password is required.',
  NEW_PASSWORD_REQUIRED = 'New password is required.',
  CONFIRM_PASSWORD_REQUIRED = 'Confirmation of password is required.',
  PASSWORD_FORMAT = 'Password must contain at least 8 characters, lowercase, uppercase, numbers and special characters',
  PASSWORD_MATCH = 'Passwords are not matching.',
  EMAIL_REQUIRED = 'Email is required.',
  EMAIL_INVALID = 'Please enter valid email.',
  BANK_ACC_INVALID = 'Please enter valid Bankaccount.',
  EMAIL_PART_INVALID = 'You have to insert valid email or part of email in form %segment%, example: (angela@gmail.com or %angela%)',
  MONEY_VALUE = 'Please insert valid money between 0.00 and 999.99',
  EPISODE = 'Please insert valid episode identifier'
}