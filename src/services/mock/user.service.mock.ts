import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { CacheEventBus } from 'event-buses';
import { User } from 'models';
import { BaseService, UserService } from 'services';
import { UserUtility } from 'utility';
import { UsersWithEmails } from './mock-data/users-with-emails.data';

@Injectable()
export class UserServiceMock extends UserService {
  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, cacheEventBus);
  }

  search():  Observable<Array<any>>{
    return Observable.of(UserUtility.BuildUsersFromResponse(UsersWithEmails));
  }
}
