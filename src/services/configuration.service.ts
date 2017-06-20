import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { CacheEventBus } from 'event-buses';
import { Property } from 'models';
import { BaseService, CacheConfig } from 'services';

@Injectable()
export class ConfigurationService extends BaseService<Property> {
  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, Property, {
      rootApiUrl: environment.restUrls.ca,
      urlSuffix: 'connection',
      urlSuffixPlural: 'connection',
      cacheConfig: {
        tag: 'ConfigurationService',
        isCacheable: false
      }
    }, cacheEventBus);
  }

  properties(): Observable<Property[]> {
    return super.executeListOperation(null, 'properties');
  }
}
