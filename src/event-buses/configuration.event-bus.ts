import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { CacheServiceConfigType } from 'services';
import { ConfigurationEventType } from 'enumerations';
import { ConfigurationEvent } from '../services/configuration.event';
import { Configuration, Property } from 'models';

@Injectable()
export class ConfigurationEventBus {
    private counter: number = 0;
    private properties: Property[];
    private configuration: Configuration = new Configuration();

    private configurationChangedSource = new Subject<ConfigurationEvent>();
    public configurationChangedEvent$ = this.configurationChangedSource.asObservable();

    public constructor() { }

    setProperties(properties: Property[]) {
        let propertiesAreDirty = false;
        this.properties = properties;
        this.properties.forEach(property => {
            if (this.configuration[property.name] !== property.value) {
                propertiesAreDirty = true;
                this.configuration[property.name] = property.value;
            }
        });
        if (propertiesAreDirty) {
            this.triggerConfigurationChangedEvent(ConfigurationEventType.SetProperties);
        }
        return this;
    }

    getConfiguration(name: string): string {
        if (this.configuration.hasOwnProperty(name)) {
            return this.configuration[name];
        } else {
            return null;
        }
    }

    private triggerConfigurationChangedEvent(configurationEventType: ConfigurationEventType) {
        this.counter ++;
        const configurationEvent: ConfigurationEvent = new ConfigurationEvent(configurationEventType, this.configuration, this.counter);
        this.configurationChangedSource.next(configurationEvent);
    }
}
