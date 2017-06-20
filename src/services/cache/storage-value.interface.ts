import { CacheConfig } from 'services';

export interface IStorageValue {

    /**
     * Cached data
     */
    value: any;

    /**
     * Cached options
     */
    cacheConfig: CacheConfig;
}
