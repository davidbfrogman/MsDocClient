import {Injectable, Optional} from '@angular/core';
import {CacheStorageType} from '../../enumerations';
import {CacheServiceConfigType } from './cache-service.config';
import {CacheMemoryStorage} from './cache-memory.storage';
import {StorageValueInterface} from './storage-value.interface';

@Injectable()
export class CacheService {
    
    /**
     * Default cache options
     * @type CacheServiceConfigType
     * @private
     */
    private defaultOptions: CacheServiceConfigType = {
        expires: Number.MAX_VALUE,
        maxAge : Number.MAX_VALUE
    };

    /**
     * Cache prefix
     */
    private _prefix: string = 'CacheService';

    /**
     * Default cache storage
     * @type CacheMemoryStorage
     * @private
     */
    private storage = new CacheMemoryStorage();

    constructor() { }

    /**
     * Set data to cache
     * @param key
     * @param value
     * @param options
     */
    public set(key: string, value: any, options?: CacheServiceConfigType) {
        let storageKey = this.toStorageKey(key);
        options = options ? options : this.defaultOptions;
        if (this.storage.setItem(storageKey, this.toStorageValue(value, options))) {
            if (!this.isSystemKey(key) && options.tag) {
                this.saveTag(options.tag, storageKey);
            }
            return true;
        }
        return false;
    }


    /**
     * Get data from cache
     * @param key
     * @returns {any}
     */
    public get(key: string): any {
        let storageValue = this.storage.getItem(this.toStorageKey(key)),
            value: any = null;
        if (storageValue) {
            if (this.validateStorageValue(storageValue)) {
                value = storageValue.value;
            } else {
                this.remove(key);
            }
        }
        return value;
    }

    /**
     * Check if value exists
     * @param key
     * @returns {boolean}
     */
    public exists(key: string): boolean {
        return !!this.get(key);
    }

    /**
     * Remove item from cache
     * @param key
     */
    public remove(key: string) {
        this.storage.removeItem(this.toStorageKey(key));
        this.removeFromTag(this.toStorageKey(key));
    }

    /**
     * Remove all from cache
     */
    public removeAll() {
        this.storage.clear();
    }

    /**
     * Get all tag data
     * @param tag
     * @returns {Array}
     */
    public getTagData(tag: string) {
        let tags = this.get(this.tagsStorageKey()) || {},
            result : {[key: string]: any} = {};
        if (tags[tag]) {
            tags[tag].forEach((key: string) => {
                let data = this.get(this.fromStorageKey(key));
                if (data) {
                    result[this.fromStorageKey(key)] = data;
                }
            });
        }
        return result;
    }

    /**
     * Remove all by tag
     * @param tag
     */
    public removeTag(tag: string) {
        let tags = this.get(this.tagsStorageKey()) || {};
        if (tags[tag]) {
            tags[tag].forEach((key: string) => {
                this.storage.removeItem(key);
            });
            delete tags[tag];
            this.set(this.tagsStorageKey(), tags);
        }
    }

    /**
     * Remove key from tags keys list
     * @param key
     * @private
     */
    private removeFromTag(key: string) {
        let tags = this.get(this.tagsStorageKey()) || {},
            index: number;
        for (let tag in tags) {
            index = tags[tag].indexOf(key);
            if (index !== -1) {
                tags[tag].splice(index, 1);
                this.set(this.tagsStorageKey(), tags);
                break;
            }
        }
    }

    private toStorageKey(key: string) {
        return this.getCachePrefix() + key;
    }

    private fromStorageKey(key: string) {
        return key.replace(this.getCachePrefix(), '');
    }

    /**
     * Prepare value to set to storage
     * @param value
     * @param options
     * @returns {{value: any, options: CacheServiceConfigType}}
     * @private
     */
    private toStorageValue(value: any, options: CacheServiceConfigType): StorageValueInterface {
        return {
            value: value,
            options: this.toStorageOptions(options)
        };
    }

    /**
     * Prepare options to set to storage
     * @param options
     * @returns {CacheServiceConfigType}
     * @private
     */
    private toStorageOptions(options: CacheServiceConfigType): CacheServiceConfigType {
        var storageOptions: CacheServiceConfigType = {};
        storageOptions.expires = options.expires ? options.expires :
            (options.maxAge ? Date.now() + (options.maxAge) : this.defaultOptions.expires);
        storageOptions.maxAge = options.maxAge ? options.maxAge : this.defaultOptions.maxAge;
        return storageOptions;
    }

    /**
     * Validate storage value
     * @param value
     * @returns {boolean}
     * @private
     */
    private validateStorageValue(value: StorageValueInterface) {
        return !!value.options.expires && value.options.expires > Date.now();
    }

    /**
     * check if its system cache key
     * @param key
     * @returns {boolean}
     * @private
     */
    private isSystemKey(key: string) {
        return [this.tagsStorageKey()].indexOf(key) !== -1;
    }

    /**
     * Save tag to list of tags
     * @param tag
     * @param key
     * @private
     */
    private saveTag(tag: string, key: string) {
        let tags = this.get(this.tagsStorageKey()) || {};
        if (!tags[tag]) {
            tags[tag] = [key];
        } else {
            tags[tag].push(key);
        }
        this.set(this.tagsStorageKey(), tags);
    }

    /**
     * Get global cache prefix
     * @returns {string}
     * @private
     */
    private getCachePrefix() {
        return this._prefix;
    }

    private tagsStorageKey() {
        return 'CacheServiceTags';
    }
}