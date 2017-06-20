import { Injectable, Optional } from '@angular/core';
import { CacheStorageType } from '../../enumerations';
import { CacheConfig } from './cache.config';
import { CacheMemoryStorage } from './cache-memory.storage';
import { IStorageValue } from './storage-value.interface';
import { ICacheStorage } from 'services/cache/cache-storage.interface';
import { CacheTag } from './cache-tag';

@Injectable()
export class CacheService {

    // Maximum number of cache items we're going to store at a time.
    private maxCacheCount: number = 100;

    // The storage mechanism for responses, and tags.
    private dataStorage = new CacheMemoryStorage<IStorageValue>();
    private tagStorage = new CacheMemoryStorage<CacheTag>();

    // Returns true, if we actually saved something to the cache, otherwise returns false.
    public set(key: string, value: any, config?: CacheConfig): boolean {
        // Before we insert a new item in the cache, let's clean it up if we're over the limit.
        if (this.dataStorage.getCount() + 1 > this.maxCacheCount) {
            this.cleanLowUsageCacheItems(this.dataStorage);
        }
        config = CacheConfig.overwriteCacheConfig(CacheConfig.getCacheConfigDefault(), config);
        if (config.isCacheable) {
            this.dataStorage.setItem(key, { value: value, cacheConfig: config });
            // If we also have a tag, on this cacheable item, we're going to save the tag in the tag storage as well. 
            if (config.tag) {
                this.setTag(config.tag, key);
            }
            return true; // Used for the event bus to tell whether to fire an event or not.
        } else {
            return false;
        }
    }

    // We need both the tag, and the key we're going to save under that tag.
    public setTag(tagKey: string, cacheKey: string) {
        const currentCacheTag: CacheTag = this.tagStorage.getItem(tagKey);
        if (currentCacheTag) {
            currentCacheTag.addKey(cacheKey);
        } else {
            const newCacheTag: CacheTag = new CacheTag();
            newCacheTag.addKey(cacheKey);
            newCacheTag.tagKey = tagKey;
            this.tagStorage.setItem(tagKey, newCacheTag);
        }
    }

    /**
     * Get data from cache
     * @param key
     * @returns {any}
     */
    public get(key: string): any {
        const storageValue = this.dataStorage.getItem(key);
        if (storageValue && this.isValid(storageValue)) {
            storageValue.cacheConfig.hitCount++;
            return storageValue.value;
        } else if (storageValue) {
            this.removeCacheItem(key, storageValue.cacheConfig.tag);
        }
        return null;
    }

    public clear() {
        this.dataStorage.clear();
        this.tagStorage.clear();
    }

    public removeAllCacheItemsByTag(tag: string) {
        const currentTag: CacheTag = this.tagStorage.getItem(tag);
        if (currentTag) {
            while (currentTag.cacheKeys.length > 0) {
                this.removeCacheItem(currentTag.cacheKeys[0], tag);
            }
        }
    }

    // This will remove the key from both the data storage, 
    // and remove it on any tags that it's a part of.
    public removeCacheItem(key: string, tag: string) {
        this.dataStorage.removeItem(key);
        if (tag) {
            this.tagStorage.getItem(tag).removeKey(key);
        }
    }

    // This algorithm isn't 100%, but should help considerably.
    // Basically we're going to try and cap the limit on the cache @ 100 items.
    // We will then clean the cache whenever we cross that limit.
    // Currently the way we clean it is we see if there's anything that has a hit count of 0.
    // Or we see if there's anything that has expired.  This will not garuntee that we will get below 100,
    // but it should be close enough for now.  In the future we could make this even smarter to factor in priority, 
    // but that's not needed for now. 
    public cleanLowUsageCacheItems(storage: CacheMemoryStorage<IStorageValue>) {
        const keys = storage.getKeys();
        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];
            let removed: boolean = false;
            const currentStorageValue: IStorageValue = storage.getItem(currentKey);
            if (currentStorageValue && currentStorageValue.cacheConfig.hitCount === 0) {
                this.removeCacheItem(currentKey, currentStorageValue.cacheConfig.tag);
                removed = true;
            }
            if (!removed && !this.isValid(currentStorageValue)) {
                this.removeCacheItem(currentKey, currentStorageValue.cacheConfig.tag);
                removed = true;
            }
        }
    }

    public isValid(value: IStorageValue) {
        return !!value.cacheConfig.expires && value.cacheConfig.expires > Date.now()
        && (value.cacheConfig.maxAge ? value.cacheConfig.createdDate + value.cacheConfig.maxAge > Date.now() : true);
    }
}
