import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { CacheEventBus } from 'event-buses';
import { Entity, Item } from 'models';
import { BaseService, ServiceConfig } from 'services';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ItemUtility } from 'utility';


@Injectable()
export class EntityService extends BaseService<Entity> {
  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, Entity, {
      rootApiUrl: environment.restUrls.ca,
      urlSuffix: 'entity',
      urlSuffixPlural: 'entities',
      urlPrefix: 'datamodel',
      encodeId: true,
      cacheConfig: {
        tag: 'EntityService',
        cache: true,
      }
    },
    cacheEventBus);
  }

  // GET /datamodel/entities/{name}/templates
  public getTemplates(entity: Entity): Observable<Item[]> {
    const url = super.buildUrl({
      id: entity.name,
      operation: 'templates'
    });
    return this.http.get(url, this.reqOptions)
      .map((res: Response) => {
        const responseObject = res.json();
        return res.json()[Object.keys(responseObject)[0]]['item'];
      })
      .map((items: Item[]) => {
        if (items && items.length > 0) {
          items.forEach(item => {
            item = ItemUtility.hydrateTemplateDetailsOnItem(item);
          });
          return items;
        }
      })
      .catch(this.handleError);
  }
}
