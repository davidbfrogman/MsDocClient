import { EnvironmentType } from '../enumerations';

export const environment = {
  environmentType: EnvironmentType.Prod,
  production: true,
  //TODO: Fill in the correct urls for production
  restApiUrl: "http://prod.idmapi.infor.com/",
  ionApiUrl: "http://prod.ionapi.infor.com"
};
