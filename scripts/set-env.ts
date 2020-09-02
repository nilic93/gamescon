import { writeFile } from 'fs';
import { argv } from 'yargs';

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const isProd = environment === 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  production: ${isProd},
  AWS_URL: "${process.env.AWS_URL}",
  COGNITO_POOL_ID: "${process.env.COGNITO_POOL_ID}",
  COGNITO_CLIENT_ID: "${process.env.COGNITO_CLIENT_ID}",
  GAME_FORMATS: "${process.env.GAME_FORMATS}"
};
`;
writeFile(targetPath, envConfigFile, { flag: 'w+' }, function(err) {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
