import { CacheServiceConfigType } from 'services';

export class ServiceConfig {
    rootApiUrl: string;
    urlSuffix: string;
    urlSuffixPlural: string;
    urlPrefix: string;
    
    // This property is used to tell the base class whether we should encode the id on requests
    // this can happen due to spaces not being properly encoded. 
    encodeId: boolean = false;
    listUsesPlural: boolean = true;

    cacheConfig: CacheServiceConfigType;

    constructor(config: ServiceConfigType) {
        this.rootApiUrl = config.rootApiUrl;
        this.urlSuffix = config.urlSuffix;
        this.urlSuffixPlural = config.urlSuffixPlural;
        this.urlPrefix = config.urlPrefix !== undefined ? config.urlPrefix : this.urlPrefix;
        this.encodeId = config.encodeId !== undefined ? config.encodeId : this.encodeId;
        this.listUsesPlural = config.listUsesPlural !== undefined ? config.listUsesPlural : this.listUsesPlural;
        this.setDefaultCacheConfig().withCacheConfig(config.cacheConfig);

        return this;
    }

    setDefaultCacheConfig(){
        this.cacheConfig = {
            cache: true,
            tag: 'BaseService',
            // we cache data for 3 days
            maxAge: 3 * 24 * 60 * 60
        };
        return this;
    }

    withCacheConfig(config?: CacheServiceConfigType) {
        this.overwriteCacheConfig(this.cacheConfig, config);
        return this;
    }

    overwriteCacheConfig(cacheConfig: CacheServiceConfigType, config?: CacheServiceConfigType) {
        if(config !== undefined) {
            cacheConfig.cache = config.cache !== undefined ? config.cache : cacheConfig.cache;
            cacheConfig.tag = config.tag !== undefined ? config.tag : cacheConfig.tag;
            cacheConfig.expires = config.expires !== undefined ? config.expires : cacheConfig.expires;
            cacheConfig.maxAge = config.maxAge !== undefined ? config.maxAge : cacheConfig.maxAge;
        }
    }

    getMethodCacheConfig(config?: CacheServiceConfigType) {
        const cacheConfig = {
            cache: this.cacheConfig.cache,
            tag: this.cacheConfig.tag,
            expires: this.cacheConfig.expires,
            maxAge: this.cacheConfig.maxAge
        };
        this.overwriteCacheConfig(cacheConfig, config);
        return cacheConfig;
    }
}

export declare type ServiceConfigType = {
    rootApiUrl: string,
    urlSuffix: string,
    urlSuffixPlural: string,
    urlPrefix?: string,
    encodeId?: boolean,
    listUsesPlural?: boolean,
    cacheConfig?: CacheServiceConfigType
};