import { CacheEventType } from 'enumerations';
import { CacheServiceConfigType } from 'services';

export class CacheEvent {
    constructor(public type: CacheEventType, public key?: string, public value?: any, public options?: CacheServiceConfigType) {}
};