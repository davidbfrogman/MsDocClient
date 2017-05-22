import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { TranslationService, CacheServiceConfigType } from 'services';
import { TranslationDictionary } from 'models';
import { TranslationsDataENUS } from './mock-data/translations-en-us';

@Injectable()
export class TranslationServiceMock extends TranslationService {
  constructor(protected http: Http) {
    super(http);
  }

  public translations(lang: string, cacheConfig?: CacheServiceConfigType): Observable<any> {
      return Observable.of(TranslationsDataENUS);
  }
}
