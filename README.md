# Gamescon project

## Installation

### Via **npm**
   - Install `node.js` and `npm` on your local machine
        - Clone this repository
        - Run `$ npm install`
        
## Development

### Local Development

   To run/develop locally you can use NPM or yarn to build and serve by running scripts:\
    Important note: 
    Before running scripts create .env file in root of project and fill values for environment variables (see content of [.env.example](./.env.example))\
    - Serve the project via: `$ npm start`
    - Build the project via: `$ npm run build`
    - Run unit tests via `$ npm test` or `$ yarn test`

## Setting up environment variables

 Create .env file in root of project with following environment variables before serving application:
 
## Variables for development:
 
  AWS endpoint for lambda sevice\
  AWS_URL=<backend-url>\
  AWS Cognito service\
  COGNITO_POOL_ID=<pool-id>\
  COGNITO_CLIENT_ID=<app-client-id>
