import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { Constants } from '../constants';
import { CacheEventBus } from 'event-buses';
import { Item } from 'models';
import { BaseService, CacheServiceConfigType } from 'services';
import { ItemUtility } from 'utility';

@Injectable()
export class ItemService extends BaseService<Item> {
  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, Item, {
      rootApiUrl: environment.restUrls.ca,
      urlSuffix: 'items',
      urlSuffixPlural: 'items',
      encodeId: true,
      listUsesPlural: false,
      cacheConfig: {
        tag: 'ItemService',
        cache: false
      }
    }, cacheEventBus);
  }

  public checkOut(id: string): Observable<Item> {
    return super.executeSingleOperation<Item>(id, 'checkout');
  }

  public checkIn(id: string): Observable<Item> {
    return super.executeSingleOperation(id, 'checkin');
  }

  public undoCheckOut(id: string): Observable<Item> {
    return super.executeSingleOperation(id, 'undocheckout');
  }

  public getVersion(id: string, version: number): Observable<Item> {
    return super.executeSingleOperation(id, `versions/${version}`);
  }

  getVersions(id: string, cacheConfig?: CacheServiceConfigType): Observable<Item[]> {
    return super.executeListOperation(id, 'versions', cacheConfig);
  }

  public revertVersion(id: string, version: number): Observable<Item> {
    return super.executeSingleOperation(id, `versions/${version}/revert`);
  }

  search(query: string, offset: number, limit: number, cacheConfig?: CacheServiceConfigType): Observable<Item[]> {
    return super.executeListOperation(null, 'search', {'$query': query, '$offset': offset, '$limit': limit}, cacheConfig);
  }

  // This is an example of how to cache the result of a searchPost
  // TODO: implement corectly the Items search that POST an object with query options
  searchPost(query: string, offset: number, limit: number, cacheConfig?: CacheServiceConfigType): Observable<Item[]> {
    const url = this.buildUrl({operation: 'search', query: {'$offset': offset, '$limit': limit}});
    const body = {queries: {query: '$query'}};
    const cachedData: any = this.getCache(url, body, cacheConfig);
    if (cachedData) {
        return Observable.of(cachedData);
    } else {
        return this.http.post(url, body, this.reqOptions).map((res: Response) => {
              const responseObject = res.json();
              const data: Item[] = responseObject[Object.keys(responseObject)[0]];
              this.setCache(url, body, data, cacheConfig);
          })
          .catch(this.handleError);
    }
  }

  public createItemFromTemplate(item: Item): Observable<Item> {
    if (!item) {
      throw new Error('Supplied item was undefined. Item should not be null to create from a template item.');
    }
    item.id = null;
     item.pid = null;
     item.version = null;
     ItemUtility.getAttributeBasedOnName(item, Constants.TEMPLATE_ATTRIBUTE_NAME).value = null;
     ItemUtility.getAttributeBasedOnName(item, Constants.TEMPLATE_ATTRIBUTE_DESCRIPTION).value = null;
     return this.create(item);
  }
}
