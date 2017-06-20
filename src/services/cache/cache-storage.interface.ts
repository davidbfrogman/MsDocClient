import {CacheStorageType} from '../../enumerations';
import {IStorageValue} from './storage-value.interface';

/**
 * Abstract cache storage
 */
export interface ICacheStorage<T> {
    // Should get the item at the key position
    getItem(key: string): T;

    // Should set the item at the key position
    // returns boolean indicating if the item was actually saved.
    setItem(key: string, value: T): boolean;

    // Should remove the item from storage
    removeItem(key: string): void;

    // Clears the entire storage
    clear(): void;

    // Returns a specific type indicating where/how the data is stored.
    type(): CacheStorageType;

    // returns whether this is enabled or not.
    isEnabled(): boolean;

    // returns a list of all the keys currently in the storage system.
    getKeys(): Array<string>;
}
