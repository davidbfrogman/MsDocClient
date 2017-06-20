import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { CacheEventBus } from 'event-buses';
import { User } from 'models/user';
import { BaseService, CacheConfig } from 'services';
import { UserUtility } from 'utility';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, User, {
      rootApiUrl: environment.restUrls.ca,
      urlSuffix: 'users', // Hardcoding this here  now.  I know this isn't right, but this service doesn't follow the standards.
      urlSuffixPlural: 'users',
      urlPrefix: 'admin',
      encodeId: true,
      cacheConfig: {
        tag: 'UserService',
        isCacheable: true
      }
    }, cacheEventBus);
  }

  search(filter: string, limit: number, cacheConfig?: CacheConfig): Observable<User[]> {
    const url = super.buildUrl({ id: null, operation: null, query: { '$filter': filter, '$limit': limit } });
    const cachedData: User[] = this.getCachedData(url, null, cacheConfig);
    if (cachedData) {
      return Observable.of(cachedData);
    } else {
      // This user search is pretty non standard.  So we're going to override it here
      return this.http.get(url, this.reqOptions).map((res: Response) => {
        const data =  UserUtility.BuildUsersFromResponse(res.json());
        this.setCachedData(url, null, data, cacheConfig);
        return data;
      })
      .catch(this.handleError);
    }
  }
}
