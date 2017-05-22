import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { CacheEventBus } from 'event-buses';
import { BaseService, ItemService } from 'services';
import { Item } from 'models';
import { ItemData } from './mock-data/item';
import { EntitiesWithAttributes } from './mock-data/entities-with-attributes.data';
import { ItemsWithTemplates } from './mock-data/items-with-templates.data';

@Injectable()
export class ItemServiceMock extends ItemService{
  public static getMockItem(): Item {
    return ItemData;
  }
  public static getMockEmptyItem(): Item {
    const item = new Item();
    item.entityName = 'MDS_File';
    return item;
  }
  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, cacheEventBus);
  }

  public getList(): Observable<Array<any>> {
    return Observable.of(ItemsWithTemplates.items.item);
  }
  public update(item: Item, pid: string, checkout?: boolean): Observable<Item> {
    console.log('MockItemService:update');
    return Observable.of(item);
  }
  public create(item: Item): Observable<Item> {
    console.log('MockItemService:create');
    return Observable.of(item);
  }

}
