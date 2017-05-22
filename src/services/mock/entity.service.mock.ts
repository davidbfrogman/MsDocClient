import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CacheEventBus } from 'event-buses';
import { BaseService, EntityService } from 'services';
import { environment } from '../../environments/environment';
import { EntitiesWithAttributes } from './mock-data/entities-with-attributes.data';
import { ItemUtility } from 'utility';
import { Entity, Item } from 'models';
import { ItemsWithTemplates } from './mock-data/items-with-templates.data';
import { EntityData } from './mock-data/entity';

@Injectable()
export class EntityServiceMock extends EntityService {
  public static getMockEntity(): Entity {
    return EntityData;
  }

  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, cacheEventBus);
  }

  public getTemplates(entity: Entity): Observable<Array<Item>> {
    const arrayOfItems = ItemsWithTemplates.items.item;
    const newItemArray = new Array<Item>();
    for (let index = 0; index < arrayOfItems.length; index++) {
      const element = arrayOfItems[index];
      let typedItem: Item = Object.assign(new Item(), element);
      typedItem = ItemUtility.hydrateTemplateDetailsOnItem(typedItem);
      newItemArray.push(typedItem);
    }
    return Observable.of(newItemArray);
  }

  getList(): Observable<Entity[]>  {
    return Observable.of([EntityData, EntityData, EntityData]);
  }
}
