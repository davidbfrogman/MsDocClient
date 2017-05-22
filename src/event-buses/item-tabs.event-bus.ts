import { Injectable, ApplicationRef } from '@angular/core';
import { Item, ItemTab } from 'models';
import { Subject } from 'rxjs/Subject';
import { ItemUtility } from '../utility';

@Injectable()
export class ItemTabsEventBus {
    public openTabs: Array<ItemTab>;

    // Observable Item Tab Sources
    private itemTabOpenedSource = new Subject<ItemTab>();
    private itemTabClosedSource = new Subject<ItemTab>();

    // Observable Item Tab Streams
    public itemTabOpened$ = this.itemTabOpenedSource.asObservable();
    public itemTabClosed$ = this.itemTabClosedSource.asObservable();

    // Counter to give unique ID for every new item tab
    private newTabCount: number = 0;

    openItemTab(item: Item) {
        if (!this.openTabs) {
            this.openTabs = new Array<ItemTab>();
        }

        const indexOfExistingTab = this.openTabs.findIndex((value) => {
            return value.tabId === this.getItemTabId(item);
        });

        if(indexOfExistingTab > -1) {
            const existingTab = this.openTabs[indexOfExistingTab];
            if(existingTab.item.version !== item.version) {
                // Another version of the item is already opened, update item
                existingTab.item = item;
                existingTab.title = this.getItemTabTitle(item, true);
            }
            this.itemTabOpenedSource.next(existingTab);
        } 
        else {
            // Open new item
            const newItemTab = {
                tabId: this.getItemTabId(item),
                title: this.getItemTabTitle(item, true),
                item: item
            }
            this.openTabs.push(newItemTab);
            this.itemTabOpenedSource.next(newItemTab);
        }
    }

    openNewItemTab(item: Item) {
        if (!this.openTabs) {
            this.openTabs = new Array<ItemTab>();
        }

        // Open new item
        const newItemTab = {
            tabId: this.getItemTabId(item, true),
            title: this.getItemTabTitle(item, true),
            item: item
        }
        this.openTabs.push(newItemTab);
        this.itemTabOpenedSource.next(newItemTab);
    }

    closeItemTab(tabId: string) {
        const indexOfItemToRemove = this.openTabs.findIndex((value) => {
            return value.tabId === tabId;
        });
        if (indexOfItemToRemove > -1) {
            const closedItem = this.openTabs.splice(indexOfItemToRemove, 1)[0];
            this.itemTabClosedSource.next(closedItem);
        }
    }

    private getItemTabId(item: Item, newItem?: boolean) {
        if (newItem === true) {
            this.newTabCount++;
            return 'NEW-' + item.entityName + '-' + this.newTabCount.toString();
        }
        return item.entityName + '-' + item.id;
    }

    private getItemTabTitle(item: Item, latestVersion: boolean): string {
        if (latestVersion) {
            return ItemUtility.getDisplayName(item);
        } else {
            return ItemUtility.getDisplayName(item); // TODO: add version
        }
    }
}