// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
import { EnvironmentType } from '../enumerations';

export const environment = {
  production: false,
  environmentType: EnvironmentType.Dev,
  // TODO: Fill in the correct urls for dev
  restUrls: {
    ca: 'https://localhost:25000/ca/api/',
    cc: 'https://localhost:25000/cc/api/',
    tr: 'https://localhost:25000/ca/'
  },
  // get configuration data interval in seconds
  pullConfigurationInterval: 60
};
