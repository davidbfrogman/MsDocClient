import { Injectable } from '@angular/core';
import { CacheStorageType } from '../../enumerations';
import { ICacheStorage } from './cache-storage.interface';
import { IStorageValue } from './storage-value.interface';

/**
 * Service for storing data in local storage
 */
@Injectable()
export class CacheMemoryStorage<T> implements ICacheStorage<T> {

    private _data: { [key: string]: any } = {};
    private _currentItemCount: number = 0;

    public getItem(key: string): T {
        return this._data[key] ? this._data[key] : null;
    }

    public setItem(key: string, value: T) {
        this._data[key] = value;
        this._currentItemCount++;
        return true;
    }

    public removeItem(key: string) {
        delete this._data[key];
        this._currentItemCount--;
    }

    public clear() {
        this._data = {};
        this._currentItemCount = 0;
    }

    public type() {
        return CacheStorageType.Memory;
    }

    public getKeys(): Array<string>{
        return Object.keys(this._data);
    }

    public getCount(): number{
        return this._currentItemCount;
    }

    public isEnabled() {
        return true;
    }
}
