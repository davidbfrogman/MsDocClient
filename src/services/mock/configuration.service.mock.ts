import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { ConfigurationService } from 'services';

@Injectable()
export class ConfigurationServiceMock extends ConfigurationService {
  constructor(protected http: Http) {
    super(http);
  }
}
