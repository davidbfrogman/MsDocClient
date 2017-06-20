import { Injectable } from '@angular/core';
import { Item } from 'models';
import { Subject } from 'rxjs/Subject';
import { ItemUtility } from 'utility';

@Injectable()
export class SelectedItemsEventBus {
    public items: Item[] = [];
    private changedSource = new Subject<String>();
    public changed$ = this.changedSource.asObservable();

    public toggle(item: Item) {
        if (this.get(item.uniqueId)) {
            this.remove(item.uniqueId);
        } else {
            this.set(item);
        }
    }

    public set(item: Item) {
        ItemUtility.setItem(this.items, item);
        this.items = this.items.slice();
        this.changedSource.next(item.uniqueId);
    }

    public get(uniqueId: string): Item {
        return ItemUtility.getItemByUniqueId(this.items, uniqueId);
    }

    public remove(uniqueId: string) {
        ItemUtility.removeItemByUniqueId(this.items, uniqueId);
        this.items = this.items.slice();
        this.changedSource.next(uniqueId);
    }

    public clear() {
        this.items = [];
        this.changedSource.next(null);
    }
}
