import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { CacheService } from '../services/cache/cache.service';
import { CacheConfig } from 'services';
import { CacheEventType } from 'enumerations';
import { CacheEvent } from '../services/cache/cache.event';
import { Property } from 'models';

@Injectable()
export class CacheEventBus {
    private cacheService: CacheService = new CacheService();
    private cacheEventSource = new Subject<CacheEvent>();
    public cacheEvent$ = this.cacheEventSource.asObservable();

    private cacheEventSetSource = new Subject<CacheEvent>();
    public cacheEventSet$ = this.cacheEventSource.asObservable();

    private cacheEventRemoveTagSource = new Subject<CacheEvent>();
    public cacheEventRemoveTag$ = this.cacheEventSource.asObservable();

    private cacheEventClearSource = new Subject<CacheEvent>();
    public cacheEventClear$ = this.cacheEventSource.asObservable();

    public constructor() { }

    set(key: string, value: any, config: CacheConfig): boolean {
        if (!config || !config.isCacheable) {
            return null;
        }
        const result: boolean = this.cacheService.set(key, value, config);
        if (result) {
            const cacheEvent: CacheEvent = new CacheEvent(CacheEventType.Get, key, value, config);
            this.cacheEventSource.next(cacheEvent);
            this.cacheEventSetSource.next(cacheEvent);
        }
        return result;
    }

    get(key: string, config: CacheConfig): any {
        if (!config || !config.isCacheable) {
            return null;
        }
        return this.cacheService.get(key);
    }

    removeByTagAndRelated(config: CacheConfig): void {
        this.removeByTag(config.tag);
        if (config.relatedTags) {
            for (let i = 0; i < config.relatedTags.length; i++) {
                const tag = config.relatedTags[i];
                this.removeByTag(tag);
            }
        }
    }

    removeByTag(tag: string){
        const cacheEvent: CacheEvent = new CacheEvent(CacheEventType.RemoveAllByTag, undefined, undefined, { tag: tag });
        this.cacheService.removeAllCacheItemsByTag(tag);
        this.cacheEventSource.next(cacheEvent);
        this.cacheEventRemoveTagSource.next(cacheEvent);
    }

    clear(): void {
        const cacheEvent: CacheEvent = new CacheEvent(CacheEventType.Clear);
        this.cacheService.clear();
        this.cacheEventSource.next(cacheEvent);
        this.cacheEventClearSource.next(cacheEvent);
    }
}
