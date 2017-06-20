import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { CacheEventBus } from 'event-buses';
import { Property } from 'models';
import { BaseService, CacheConfig } from 'services';

@Injectable()
export class AuthenticationService extends BaseService<Property> {
  constructor(protected http: Http, cacheEventBus: CacheEventBus) {
    super(http, Property, {
      rootApiUrl: environment.restUrls.ca,
      urlSuffix: 'connection',
      urlSuffixPlural: 'connection',
      cacheConfig: {
        tag: 'AuthenticationService',
        isCacheable: false
      }
    }, cacheEventBus);
  }

  login(cacheConfig?: CacheConfig): Observable<Property[]> {
    return super.executeListOperation(null, 'login', cacheConfig);
  }

  logout(cacheConfig?: CacheConfig): Observable<Property[]> {
    return super.executeListOperation(null, 'logout', cacheConfig);
  }
}
