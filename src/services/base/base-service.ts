import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Md5} from 'ts-md5/dist/md5';

import { CacheEventBus } from 'event-buses';
import { ServiceError, BaseModel } from 'models';
import { ServiceConfig, ServiceConfigType, CacheServiceConfigType } from 'services';
import { RestUrlBuilder, RestUrlConfigType } from 'utility';

export abstract class BaseService<T extends BaseModel> {
    protected restUrlBuilder: RestUrlBuilder = new RestUrlBuilder();
    protected serviceConfig: ServiceConfig;
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
        typeOfClass: {new() : T},
        serviceConfigType: ServiceConfigType,
        protected cacheEventBus: CacheEventBus
    ) {
        this.serviceConfig = new ServiceConfig(serviceConfigType);
        this.reqOptions = new RequestOptions({
            headers: new Headers({'Content-Type': 'application/json'}),
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

    getMethodCacheConfig(config?: CacheServiceConfigType) {
        return this.serviceConfig.getMethodCacheConfig(config);
    }

    getKey(url: string, body?: any): string {
        return Md5.hashStr(url).toString() + '-' + Md5.hashStr(JSON.stringify(body)).toString();
    }

    getCache(url: string, body: any, cacheConfig?: CacheServiceConfigType): any {
        if (this.cacheEventBus) {
            return this.cacheEventBus.get(this.getKey(url, body), this.getMethodCacheConfig(cacheConfig));
        } else {
            return null;
        }
    }

    setCache(url: string, body: any, data: any, cacheConfig?: CacheServiceConfigType): this {
        if (this.cacheEventBus) {
            this.cacheEventBus.set(this.getKey(url, body), data, this.getMethodCacheConfig(cacheConfig));
        }
        return this;
    }

    clearCache(): this {
        if (this.cacheEventBus) {
            this.cacheEventBus.removeTag(this.serviceConfig.cacheConfig.tag);
        }
        return this;
    }

    get<T extends BaseModel>(id: string, cacheConfig?: CacheServiceConfigType): Observable<T>  {
        const url = this.buildUrl({id});
        const cachedData: any = this.getCache(url, null, cacheConfig);
        if (cachedData) {
            return Observable.of(cachedData);
        } else {
            return this.http
                .get(url, this.reqOptions)
                .map((res: Response) => {
                    const responseObject = res.json();
                    const data = responseObject[Object.keys(responseObject)[0]];
                    this.setCache(url, null, data, cacheConfig);
                    return data;
                })
                .catch(this.handleError);
        }
    }

    getList<T extends BaseModel>(query?: Object, cacheConfig?: CacheServiceConfigType): Observable<T[]>  {
        const url = this.buildUrl({usePlural: this.serviceConfig.listUsesPlural, query});
        const cachedData: any = this.getCache(url, null, cacheConfig);
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
                    this.setCache(url, null, data, cacheConfig);
                    return data;
                })
                .catch(this.handleError);
        }
    }

    delete<T extends BaseModel>(id: string, query?: Object): Observable<void> {
        id = this.serviceConfig.encodeId ? BaseService.getPidEncoded(id) : id;
        const url = this.buildUrl({id, query});
        this.clearCache();
        return this.http
            .delete(url, this.reqOptions)
            .map((res: Response) => {
                const responseObject = res.json();
                return responseObject;
            })
            .catch(this.handleError);
    }

    create<T extends BaseModel>(T: T, query?: Object): Observable<T> {
        const url = this.buildUrl({query});
        const rootName: string = this.model.constructor.name.toLowerCase();
        const body = { [rootName]: T };
        this.clearCache();
        return this.http
            .post(this.buildUrl({query}), body, this.reqOptions)
            .map((res: Response) => {
                const responseObject = res.json();
                return responseObject[Object.keys(responseObject)[0]];
            })
            .catch(this.handleError);
    }

    update<T extends BaseModel>(T: T, pid: string, query?: Object): Observable<T> {
        const url = this.buildUrl({id: pid, query: query});
        const rootName: string = this.model.constructor.name.toLowerCase();
        const body = { [rootName]: T };
        this.clearCache();
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
    executeSingleOperation<T extends BaseModel>(id: string, operation: string, query?: Object): Observable<T> {
        const url: string = this.buildUrl({id, operation, query});
        this.clearCache();
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
        cacheConfig?: CacheServiceConfigType
    ): Observable<T[]> {
        const url = this.buildUrl({id, operation, query});
        const cachedData: any = this.getCache(url, null, cacheConfig);
        if (cachedData) {
            return Observable.of(cachedData);
        } else {
            return this.http.get(url, this.reqOptions).map((res: Response) => {
                const responseObject = res.json();
                const data = responseObject[Object.keys(responseObject)[0]];
                this.setCache(url, null, data, cacheConfig);
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
            if (typeof body.error  !== 'undefined' && typeof body.error.message !== 'undefined' && body.error.detail !== undefined) {
                appError.message = body.error.message;
                appError.description = body.error.detail;
            } else if (errorResponse.status === 0) {
                appError.message = `API call failed`;
            }  else {
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
