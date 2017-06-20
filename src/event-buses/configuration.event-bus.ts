import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { CacheConfig } from 'services';
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

    public setProperties(properties: Property[]): this {
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

    public getConfiguration(name: string): string {
        if (this.configuration.hasOwnProperty(name)) {
            return this.configuration[name];
        } else {
            return null;
        }
    }

    public getConfigurationAsNumber(name: string, fallback: number = 0): number {
      const configuration: string = this.getConfiguration(name);
      if (configuration === null) {
        return fallback;
      }
      return parseInt(configuration, 10);
    }

    private triggerConfigurationChangedEvent(configurationEventType: ConfigurationEventType) {
        this.counter ++;
        const configurationEvent: ConfigurationEvent = new ConfigurationEvent(configurationEventType, this.configuration, this.counter);
        this.configurationChangedSource.next(configurationEvent);
    }
}
