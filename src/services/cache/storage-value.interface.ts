import { CacheServiceConfigType } from 'services';

export interface StorageValueInterface {

    /**
     * Cached data
     */
    value: any;

    /**
     * Cached options
     */
    options: CacheServiceConfigType;
}
