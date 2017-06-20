import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { ConfigurationService } from 'services';
import { CacheEventBus } from 'event-buses';

@Injectable()
export class ConfigurationServiceMock extends ConfigurationService {
  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, cacheEventBus);
  }
}
