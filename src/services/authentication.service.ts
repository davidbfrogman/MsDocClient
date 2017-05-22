import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { CacheEventBus } from 'event-buses';
import { Property } from 'models';
import { BaseService, CacheServiceConfigType } from 'services';

@Injectable()
export class AuthenticationService extends BaseService<Property> {
  constructor(protected http: Http) {
    super(http, Property, { 
      rootApiUrl: environment.restUrls.ca,
      urlSuffix: 'connection',
      urlSuffixPlural: 'connection',
      cacheConfig: {
        tag: 'AuthenticationService',
        cache: false
      }
    }, null);
  }

  login(cacheConfig?: CacheServiceConfigType): Observable<Property[]> {
    return super.executeListOperation(null, 'login', cacheConfig);
  }

  logout(cacheConfig?: CacheServiceConfigType): Observable<Property[]> {
    return super.executeListOperation(null, 'logout', cacheConfig);
  }
}
