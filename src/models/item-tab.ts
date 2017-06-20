import { Item } from './item';

export class ItemTab {
    public tabId: string;
    public title: string;
    public item: Item;
    public latestVersion: boolean = true;
}
