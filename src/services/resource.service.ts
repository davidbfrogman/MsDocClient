import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { CacheEventBus } from 'event-buses';
import { ServiceError, ResourceData } from 'models';
import { BaseService } from 'services';
import { ResourceDataUtility } from 'utility';

@Injectable()
export class ResourceService extends BaseService<ResourceData> {

  constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
    super(http, ResourceData, {
      rootApiUrl: environment.restUrls.ca,
      urlSuffix: 'items',
      urlSuffixPlural: 'items',
      encodeId: true,
      listUsesPlural: false
    }, cacheEventBus);
  }

  getResourceStream(pid: string, conversion: string): Observable<ResourceData> {
    const reqOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'}),
        responseType: ResponseContentType.ArrayBuffer,
        withCredentials: true
    });
    const url = this.buildUrl({id: pid, operation: `resource/${conversion}/stream`});

    return this.http
        .get(url, reqOptions)
        .map((res: Response) => {
            return ResourceDataUtility.fromResponse(res);
        })
        .catch(this.handleError);
  }

  /**
   * Overriding to handle arrayBuffer response
   *
   * @param errorResponse
   */
  protected handleError(errorResponse: Response | any) {
      // TODO: Implement Real Logging infrastructure.
      // Might want to log to remote server (Fire and forget style)
      const appError = new ServiceError();
      if (errorResponse instanceof Response) {
          const body = errorResponse.arrayBuffer();
          const text = String.fromCharCode.apply(null, new Uint8Array(body));
          const xml = new DOMParser().parseFromString(text, 'text/xml');

          if (xml.getElementsByTagName('message')[0] && xml.getElementsByTagName('detail')[0]) {
            appError.message = xml.getElementsByTagName('message')[0].firstChild.nodeValue;
            appError.description =  xml.getElementsByTagName('detail')[0].firstChild.nodeValue;
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
