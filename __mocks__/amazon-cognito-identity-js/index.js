module.exports = {
  CognitoUserPool: jest.fn().mockImplementation(
    require('./CognitoUserPool')
  )
}