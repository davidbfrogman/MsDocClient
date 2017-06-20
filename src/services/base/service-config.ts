import { CacheConfig } from 'services';

export class ServiceConfig {
    rootApiUrl: string;
    urlSuffix: string;
    urlSuffixPlural: string;
    urlPrefix: string;

    // This property is used to tell the base class whether we should encode the id on requests
    // this can happen due to spaces not being properly encoded.
    encodeId: boolean = false;
    listUsesPlural: boolean = true;

    serviceCacheConfig: CacheConfig;

    constructor(config: ServiceConfigType) {
        this.rootApiUrl = config.rootApiUrl;
        this.urlSuffix = config.urlSuffix;
        this.urlSuffixPlural = config.urlSuffixPlural;
        this.urlPrefix = config.urlPrefix !== undefined ? config.urlPrefix : this.urlPrefix;
        this.encodeId = config.encodeId !== undefined ? config.encodeId : this.encodeId;
        this.listUsesPlural = config.listUsesPlural !== undefined ? config.listUsesPlural : this.listUsesPlural;

        // We're going to send in the config that we have, and merge it with default values so we can 
        // have a fully filled out object with defaults for anything that wasn't passed in.
        this.serviceCacheConfig = CacheConfig.overwriteCacheConfig(CacheConfig.getCacheConfigDefault(), config.cacheConfig);
        return this;
    }
}

export interface ServiceConfigType {
    rootApiUrl: string;
    urlSuffix: string;
    urlSuffixPlural: string;
    urlPrefix?: string;
    encodeId?: boolean;
    listUsesPlural?: boolean;
    cacheConfig?: CacheConfig;
};
