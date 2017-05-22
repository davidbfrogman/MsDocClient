import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { CacheService } from '../services/cache/cache.service';
import { CacheServiceConfigType } from 'services'
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
    
    private cacheEventRemoveAllSource = new Subject<CacheEvent>();
    public cacheEventRemoveAll$ = this.cacheEventSource.asObservable();

    public constructor() { }
    
    set(key: string, value: any, options: CacheServiceConfigType): boolean {
        if(!options.cache) return null;
        const result: boolean = this.cacheService.set(key, value, options);
        if(result) {
            const cacheEvent: CacheEvent = new CacheEvent(CacheEventType.Get, key, value, options);
            this.cacheEventSource.next(cacheEvent);
            this.cacheEventSetSource.next(cacheEvent);
        }
        return result;
    }

    get(key: string, options: CacheServiceConfigType): any {
        if(!options.cache) return null;
        return this.cacheService.get(key);
    }

    removeTag(tag: string): void {
        const cacheEvent: CacheEvent = new CacheEvent(CacheEventType.RemoveTag, undefined, undefined, {tag: tag});
        this.cacheEventSource.next(cacheEvent);
        this.cacheEventRemoveTagSource.next(cacheEvent);
        this.cacheService.removeTag(tag);
    }

    removeAll(): void {
        const cacheEvent: CacheEvent = new CacheEvent(CacheEventType.RemoveAll);
        this.cacheEventSource.next(cacheEvent);
        this.cacheEventRemoveAllSource.next(cacheEvent);
        this.cacheService.removeAll();
    }
}
