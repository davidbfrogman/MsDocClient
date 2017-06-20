import { CacheEventType } from 'enumerations';
import { CacheConfig } from 'services';

export class CacheEvent {
    constructor(public type: CacheEventType, public key?: string, public value?: any, public options?: CacheConfig) {}
};
