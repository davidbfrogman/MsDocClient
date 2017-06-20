import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Md5 } from 'ts-md5/dist/md5';

import { CacheEventBus } from 'event-buses';
import { ServiceError, BaseModel } from 'models';
import { ServiceConfig, ServiceConfigType, CacheConfig } from 'services';
import { RestUrlBuilder, RestUrlConfigType } from 'utility';
import { MimeType } from 'enumerations';

export abstract class BaseService<T extends BaseModel> {
    protected restUrlBuilder: RestUrlBuilder = new RestUrlBuilder();
    public serviceConfig: ServiceConfig;
    protected reqOptions: RequestOptions;
    protected model;

    // tslint:disable-next-line:member-ordering
    public static convertToClass<T>(obj: Object, classToInstantiate): T {
        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                classToInstantiate[i] = obj[i];
            }
        }
        return classToInstantiate;
    }

    public static getPidEncoded(id: string): string {
        return (id) ? id.replace(` `, `%20`) : id;
    }

    constructor(
        protected http: Http,
        typeOfClass: { new (): T },
        serviceConfigType: ServiceConfigType,
        protected cacheEventBus: CacheEventBus
    ) {
        this.serviceConfig = new ServiceConfig(serviceConfigType);
        this.reqOptions = new RequestOptions({
            headers: new Headers({ 'Content-Type': MimeType.JSON }),
            withCredentials: true
        });

        this.restUrlBuilder.withConfig({
            rootApiUrl: this.serviceConfig.rootApiUrl,
            urlSuffix: this.serviceConfig.urlSuffix,
            urlSuffixPlural: this.serviceConfig.urlSuffixPlural,
            urlPrefix: this.serviceConfig.urlPrefix
        });
        this.model = new typeOfClass();
        return this;
    }

    getCacheKey(url: string, body?: any): string {
        // tslint:disable-next-line:max-line-length
        return this.serviceConfig.serviceCacheConfig.tag
            + ': ' + url.substring(0, 100)
            + ' hash:' + Md5.hashStr(url).toString()
            + (!!body ? + ' bodyHash:' + Md5.hashStr(JSON.stringify(body)).toString() : '');
    }

    getCachedData(url: string, body: any, cacheConfig?: CacheConfig): any {
        // We're going to overlay the overrides on the cache config passed in with any defaults that are at the service layer.
        cacheConfig = CacheConfig.overwriteCacheConfig(this.serviceConfig.serviceCacheConfig, cacheConfig); 
        return this.cacheEventBus.get(this.getCacheKey(url, body), cacheConfig);
    }

    setCachedData(url: string, body: any, data: any, cacheConfig?: CacheConfig): this {
        // We're going to overlay the overrides on the cache config passed in with any defaults that are at the service layer.
        cacheConfig = CacheConfig.overwriteCacheConfig(this.serviceConfig.serviceCacheConfig, cacheConfig);
        this.cacheEventBus.set(this.getCacheKey(url, body), data, cacheConfig);
        return this;
    }

    clearRelatedCache() {
        this.cacheEventBus.removeByTagAndRelated(this.serviceConfig.serviceCacheConfig);
    }

    get<T extends BaseModel>(id: string, cacheConfig?: CacheConfig): Observable<T> {
        const url = this.buildUrl({ id });
        const cachedData: any = this.getCachedData(url, null, cacheConfig);
        if (cachedData) {
            return Observable.of(cachedData);
        } else {
            return this.http
                .get(url, this.reqOptions)
                .map((res: Response) => {
                    const responseObject = res.json();
                    const data = responseObject[Object.keys(responseObject)[0]];
                    if (res.status === 200) {
                        this.setCachedData(url, null, data, cacheConfig);
                    }
                    return data;
                })
                .catch(this.handleError);
        }
    }

    getList<T extends BaseModel>(query?: Object, cacheConfig?: CacheConfig): Observable<T[]> {
        const url = this.buildUrl({ usePlural: this.serviceConfig.listUsesPlural, query });
        const cachedData: any = this.getCachedData(url, null, cacheConfig);
        if (cachedData) {
            return Observable.of(cachedData);
        } else {
            return this.http
                .get(url, this.reqOptions)
                .map((res: Response) => {
                    const responseObject = res.json();
                    // This looks really funny, but basically list operations
                    //   return a root for the list, and then another root for the items.
                    // So you have to de reference the root 2 times, for example first with "Entities", and then with "Entity" to actually
                    // access the array that's returned.
                    // We might be able to clean this up with url suffix if this is too obnoxious to debug.
                    const data =
                        responseObject[Object.keys(responseObject)[0]][Object.keys(responseObject[Object.keys(responseObject)[0]])[0]];
                    if (res.status === 200) {
                        this.setCachedData(url, null, data, cacheConfig);
                    }
                    return data;
                })
                .catch(this.handleError);
        }
    }

    delete<T extends BaseModel>(id: string, query?: Object): Observable<void> {
        id = this.serviceConfig.encodeId ? BaseService.getPidEncoded(id) : id;
        const url = this.buildUrl({ id, query });
        this.clearRelatedCache();
        return this.http
            .delete(url, this.reqOptions)
            .map((res: Response) => {
                const responseObject = res.json();
                return responseObject;
            })
            .catch(this.handleError);
    }

    create<T extends BaseModel>(T: T, query?: Object): Observable<T> {
        const url = this.buildUrl({ query });
        const rootName: string = this.model.constructor.name.toLowerCase();
        const body = { [rootName]: T };
        this.clearRelatedCache();
        return this.http
            .post(this.buildUrl({ query }), body, this.reqOptions)
            .map((res: Response) => {
                const responseObject = res.json();
                return responseObject[Object.keys(responseObject)[0]];
            })
            .catch(this.handleError);
    }

    update<T extends BaseModel>(T: T, pid: string, query?: Object): Observable<T> {
        const url = this.buildUrl({ id: pid, query: query });
        const rootName: string = this.model.constructor.name.toLowerCase();
        const body = { [rootName]: T };
        this.clearRelatedCache();
        return this.http
            .put(url, { [rootName]: T }, this.reqOptions)
            .map((res: Response) => {
                const responseObject = res.json();
                return responseObject[Object.keys(responseObject)[0]];
            })
            .catch(this.handleError);
    }

    // This is used for single operations that execute, and return a single object.
    // item.checkout is a good example of this kind of operation.
    // We will clear chache when this method gets executed
    executeSingleOperation<T extends BaseModel>(id: string, operation?: string, query?: Object): Observable<T> {
        const url: string = this.buildUrl({ id, operation, query });
        this.clearRelatedCache();
        return this.http
            .get(url, this.reqOptions)
            .map((res: Response) => {
                const responseObject = res.json();
                return responseObject[Object.keys(responseObject)[0]];
            })
            .catch(this.handleError);
    }

    // This is used for listing operations that return a list of objects.
    // item.versions is a good example, where you're going to return a list of items.
    executeListOperation<T extends BaseModel>(
        id: string,
        operation: string,
        query?: Object,
        cacheConfig?: CacheConfig
    ): Observable<T[]> {
        const url = this.buildUrl({ id, operation, query });
        const cachedData: any = this.getCachedData(url, null, cacheConfig);
        if (cachedData) {
            return Observable.of(cachedData);
        } else {
            return this.http.get(url, this.reqOptions).map((res: Response) => {
                const responseObject = res.json();
                const data = responseObject[Object.keys(responseObject)[0]];
                if (res.status === 200) {
                    this.setCachedData(url, null, data, cacheConfig);
                }
                return data;
            })
                .catch(this.handleError);
        }
    }

    protected buildUrl(configuration?: RestUrlConfigType): string {
        return this.restUrlBuilder.withConfig(configuration).build();
    }

    protected handleError(errorResponse: Response | any) {
        // TODO: Implement Real Logging infrastructure.
        // Might want to log to remote server (Fire and forget style)
        const appError = new ServiceError();
        if (errorResponse instanceof Response) {
            const body = errorResponse.json() || '';
            if (typeof body.error !== 'undefined' && typeof body.error.message !== 'undefined' && body.error.detail !== undefined) {
                appError.message = body.error.message;
                appError.description = body.error.detail;
            } else if (errorResponse.status === 0) {
                appError.message = `API call failed`;
            } else {
                appError.message = `${errorResponse.status} - ${errorResponse.statusText || ''}`;
            }
            appError.statusCode = errorResponse.status;
            appError.statusText = errorResponse.statusText;
            return Observable.throw(appError);
        } else {
            appError.message = typeof errorResponse.message !== 'undefined' ? errorResponse.message : errorResponse.toString();
            return Observable.throw(appError);
        }
    }
}
