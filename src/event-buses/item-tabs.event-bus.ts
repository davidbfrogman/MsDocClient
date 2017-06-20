import { Injectable } from '@angular/core';
import { Item, ItemTab } from 'models';
import { Subject } from 'rxjs/Subject';
import { ItemUtility } from 'utility';

@Injectable()
export class ItemTabsEventBus {
    public openTabs: Array<ItemTab> = [];

    // Observable Item Tab Sources
    private itemTabOpenedSource = new Subject<ItemTab>();
    private itemTabClosedSource = new Subject<ItemTab>();

    // Observable Item Tab Streams
    public itemTabOpened$ = this.itemTabOpenedSource.asObservable();
    public itemTabClosed$ = this.itemTabClosedSource.asObservable();

    // Counter to give unique ID for every new item tab
    private newTabCount: number = 0;

    public open(item: Item) {
        if (this.get(ItemUtility.getTabId(item))) {
            this.update(item);
        } else {
            this.createTab(item);
        }
    }

    public get(tabId: string): ItemTab {
        let foundTab: ItemTab = null;
        this.openTabs.forEach(tab => {
            if (tabId === tab.tabId) {
                foundTab = tab;
            }
        });
        return foundTab;
    }

    public update(item: Item, itemBefore: Item = null) {
        let found: boolean = false;
        this.openTabs.forEach(tab => {
            if (itemBefore !== null && ItemUtility.getTabId(itemBefore) === tab.tabId ||
                item.uniqueId === tab.item.uniqueId) {
                found = true;
                this.updateTab(tab, item);
                this.itemTabOpenedSource.next(tab);
            }
        });
        return found;
    }

    public close(tabId: string) {
        const indexOfItemToRemove = this.openTabs.findIndex((value) => {
            return value.tabId === tabId;
        });
        if (indexOfItemToRemove > -1) {
            const closedItem = this.openTabs.splice(indexOfItemToRemove, 1)[0];
            this.itemTabClosedSource.next(closedItem);
        }
    }

    private createTab(item: Item) {
        const newTab = new ItemTab();
        this.updateTab(newTab, item);
        this.openTabs.push(newTab);
        this.itemTabOpenedSource.next(newTab);
    }

    private updateTab(tab: ItemTab, item: Item) {
        tab.item = item;
        tab.title = ItemUtility.getDisplayName(item);
        tab.tabId = ItemUtility.getTabId(item);
        tab.latestVersion = ItemUtility.isLatest(item);
    }
}
