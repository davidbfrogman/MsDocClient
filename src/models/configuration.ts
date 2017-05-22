import { BaseModel } from './';

export class Configuration extends BaseModel {
    IsTransactionSupported: string;
    SearchLimit: string;
    SupportsDisplayName: string;
    Version: string;
    Username: string;
    Roles: string;
    DisplayName: string;
    EntitiesTimestamp: string;
    ResultListsTimestamp: string;
    BusinessContextModelsTimestamp: string;
    IonEntitiesFilterTimestamp: string;
    IonActiveTimestamp: string;
    IonWorkflowConfigurationsTimestamp: string;
    ImplName: string;
    ImplDescription: string;
    SearchResultPageSize: string;
    ContextualApplicationResultPageSize: string;
    MaxFileSize: string;
    ApplicationLid: string;
}
