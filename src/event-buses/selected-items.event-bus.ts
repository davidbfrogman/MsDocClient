import { Injectable, ApplicationRef } from '@angular/core';
import { Item } from 'models';
import { Subject } from 'rxjs/Subject';
import { ItemUtility } from 'utility';

@Injectable()
export class SelectedItemsEventBus {
    public selectedItems: Array<Item>;

    // Observable Selected Items Sources
    private selectedItemsSource = new Subject<Item[]>();


    // Observable Selected Items Streams
    public selectedItemsChanged$ = this.selectedItemsSource.asObservable();

    toggleSelectItem(item: Item) {
        if (!this.selectedItems) {
            this.selectedItems = new Array<Item>();
        }

        const indexOfAlreadySelectedItem = this.selectedItems.findIndex((value) => {
            return value.pid === item.pid;
        });

        if (indexOfAlreadySelectedItem > -1) {
            const deselectedItem = this.selectedItems.splice(indexOfAlreadySelectedItem, 1)[0];
            this.selectedItemsSource.next(this.selectedItems);
        } else {
            this.selectedItems.push(item);
            this.selectedItemsSource.next(this.selectedItems);
        }
    }
    
    updateSelectedItem(updatedItemItem: Item) {
        const newSelectedItems: Item[] = new Array<Item>();
        this.selectedItems.forEach(item => {
            if (ItemUtility.isTheSameItem(item, updatedItemItem)) {
                item = updatedItemItem;
            }
            newSelectedItems.push(item);
        });
        this.selectedItems = newSelectedItems;
        this.selectedItemsSource.next(this.selectedItems);
    }
}
