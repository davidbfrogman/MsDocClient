import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { Constants } from '../constants';
import { CacheEventBus } from 'event-buses';
import { Item } from 'models';
import { BaseService, CacheConfig } from 'services';
import { ItemUtility } from 'utility';
import { MimeType } from 'enumerations';

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
        tag: Constants.ITEM_SERVICE_CACHE_TAG,
        isCacheable: false,
        relatedTags: [Constants.RESOURCE_SERVICE_CACHE_TAG]
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

  getVersions(id: string, cacheConfig?: CacheConfig): Observable<Item[]> {
    return super.executeListOperation(id, 'versions', cacheConfig);
  }

  public retrieve(id: string): Observable<Item> {
    return super.executeSingleOperation(id);
  }

  public revertVersion(id: string, version: number): Observable<Item> {
    return super.executeSingleOperation(id, `versions/${version}/revert`);
  }

  public search(
    query: string, offset: number, limit: number, includeCount: boolean = true,
    cacheConfig?: CacheConfig
  ): Observable<Item[]> {
    const url = this.buildUrl({
      operation: 'search',
      query: { '$offset': offset, '$limit': limit, '$includeCount': includeCount.toString() }
    });
    const body = query;
    const cachedData: any = this.getCachedData(url, body, cacheConfig);
    if (cachedData) {
      return Observable.of(cachedData);
    } else {
      const reqOptions: RequestOptions = new RequestOptions({
        headers: new Headers({ 'Content-Type': MimeType.TEXT }),
        withCredentials: true
      });
      return this.http.post(url, body, reqOptions).map((res: Response) => {
        const responseObject = res.json();
        const data: Item[] = responseObject.items;
        this.setCachedData(url, body, data, cacheConfig);
        return data;
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
