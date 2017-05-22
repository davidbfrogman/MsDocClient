import { ConfigurationEventType } from 'enumerations';
import { Configuration } from 'models';

export class ConfigurationEvent {
    constructor(public type: ConfigurationEventType, public configuration: Configuration, public counter: number) {}
};
