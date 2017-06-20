// This is a helper class that wraps the tags for the cache. 
// It's basically the association between the tag, and all of its related keys.
export class CacheTag {
    public tagKey: string;
    public cacheKeys: Array<string> = new Array<string>();

    // This allows us to keep the list of keys unique, and save a few operations
    // when we are trying to clear the cache based on tag, and iterating through the keys.
    public addKey(key: string) {
        const index = this.cacheKeys.indexOf(key);
        if (index === -1) {
            this.cacheKeys.push(key);
        }
    }
    
    public removeKey(key: string) {
        const index = this.cacheKeys.indexOf(key);
        if (index > -1) {
            this.cacheKeys.splice(index, 1);
        }
    }
}
