import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { TranslationService, CacheConfig } from 'services';
import { TranslationDictionary } from 'models';
import { TranslationsDataENUS } from './mock-data/translations-en-us';
import { CacheEventBus } from "event-buses";

@Injectable()
export class TranslationServiceMock extends TranslationService {
  constructor(protected http: Http, cacheEventBus: CacheEventBus) {
    super(http, cacheEventBus);
  }

  public translations(lang: string, cacheConfig?: CacheConfig): Observable<any> {
      return Observable.of(TranslationsDataENUS);
  }
}
