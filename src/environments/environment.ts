// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// this file is never used directly. It is used to typehint environment variables
// in IDE. It is important to add new variables here and in ./scripts/set-env.ts file
export const environment = {
  production: false,

  // env variables
  AWS_URL: '',
  COGNITO_POOL_ID: 'eu-central-1_RwGEd3eZt',
  COGNITO_CLIENT_ID: 'qc1f912b8rtoqv6o82vetga61',
  GAME_FORMATS: 'one, two, tree'
};
