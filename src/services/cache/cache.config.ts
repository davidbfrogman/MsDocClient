export class CacheConfig {
    // Is this even cacheable?
    isCacheable?: boolean;

    // What string style tag should we use as part of the cache key?
    tag?: string;

    // timestamp when the cache expires
    expires?: number;

    // number of milliseconds that the cache is active
    maxAge?: number;

    // A timestamp of when this item was put into the cache
    createdDate?: number;

    // This will be used later to determine things that are a high priority,
    // And should be saved.
    priority?: number;

    // Used to determine how valuble an item in the queue is.
    hitCount?: number;

    // These are the tags that will be cleared from the cache, if this item is updated.
    // A good example is that when an item is updated, its resources are all cleared from the cache as well.
    relatedTags?: Array<string>;

    public static getCacheConfigDefault(): CacheConfig {
        const cacheConfig: CacheConfig = {
            isCacheable: false,
            tag: 'DefaultServiceCacheTag',
            // we cache data for 3 days
            maxAge: 3 * 24 * 60 * 60,
            createdDate: Date.now(),
            expires: Number.MAX_SAFE_INTEGER,
            hitCount: 0,
            priority: 0,
            relatedTags: Array<string>(),
        };
        return cacheConfig;
    }

    // This will overwrite the default with values from the overrides, as long as the overrides is defined.
    public static overwriteCacheConfig(defaults: CacheConfig, overrides?: CacheConfig): CacheConfig {
        if (overrides !== undefined) {
            defaults.isCacheable = overrides.isCacheable ? overrides.isCacheable : defaults.isCacheable;
            defaults.tag = overrides.tag ? overrides.tag : defaults.tag;
            defaults.expires = overrides.expires ? overrides.expires : defaults.expires;
            defaults.maxAge = overrides.maxAge ? overrides.maxAge : defaults.maxAge;
            defaults.hitCount = overrides.hitCount ? overrides.hitCount : defaults.hitCount;
            defaults.priority = overrides.priority ? overrides.priority : defaults.priority;
            defaults.relatedTags = overrides.relatedTags ? overrides.relatedTags : defaults.relatedTags;
            defaults.createdDate = overrides.createdDate ? overrides.createdDate : defaults.createdDate;
        }
        return defaults;
    }
};
