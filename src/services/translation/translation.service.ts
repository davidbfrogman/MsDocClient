import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { CacheEventBus } from 'event-buses';
import { TranslationDictionary } from 'models';
import { BaseService, CacheConfig } from 'services';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TranslationService extends BaseService<TranslationDictionary> {
  constructor(protected http: Http, cacheEventBus: CacheEventBus) {
    super(http, TranslationDictionary, {
      rootApiUrl: environment.restUrls.tr,
      urlSuffix: 'translations',
      urlSuffixPlural: 'translations',
      cacheConfig: {
        tag: 'TranslationService',
        isCacheable: true
      }
    }, cacheEventBus);
  }

  public translations(lang: string, cacheConfig?: CacheConfig): Observable<TranslationDictionary> {
    const url = super.buildUrl({ id: null, operation: lang });
    const cachedData: TranslationDictionary = this.getCachedData(url, null, cacheConfig);
    if (cachedData) {
      return Observable.of(cachedData);
    } else {
      // This translation search is pretty non standard.  So we're going to override it here
      return this.http.get(url, this.reqOptions).map((res: Response) => {
        const data =  res.json();
        this.setCachedData(url, null, data, cacheConfig);
        return data;
      })
      .catch(this.handleError);
    }
  }
}
