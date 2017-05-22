export interface CacheServiceConfigType {
    cache?: boolean;
    tag?: string;
    // timestamp when the cache expires
    expires?: number;
    // number of milliseconds that the cache is active
    maxAge?: number;
};
