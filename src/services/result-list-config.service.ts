import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { CacheEventBus } from 'event-buses';
import { ResultListConfig } from 'models';
import { BaseService, CacheConfig } from 'services';

@Injectable()
export class ResultListConfigService extends BaseService<ResultListConfig> {
  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, ResultListConfig, {
      rootApiUrl: environment.restUrls.ca,
      urlSuffix: 'config',
      urlSuffixPlural: 'config',
      cacheConfig: {
        tag: 'ResultListConfigService',
        isCacheable: true,
      }
    }, cacheEventBus);
  }

  resultList(cacheConfig?: CacheConfig): Observable<ResultListConfig[]> {
    return super.executeListOperation(null, `resultlists`, cacheConfig);
  }
}
