
import {} from 'jasmine';
import { HttpModule, Http, BaseRequestOptions, XHRBackend, Response, ResponseOptions, RequestMethod } from "@angular/http";
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { Item } from '../models';
import { ItemService } from './';
import { CacheEventBus } from 'event-buses';

describe('ItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        CacheEventBus,
        ItemService,
        MockBackend,
        BaseRequestOptions,
        { provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions] 
        }
      ]
    });
  });

  it('should ...', inject([ItemService], (service: ItemService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable<Array<Items>>', async(
    inject([ItemService, MockBackend], (service: ItemService, mockBackend: MockBackend) => {
    const mockResponse = {"items":{"searchXQuery":"\/MDS_File","item":[{"createdBy":"ADAN-IDM-ADMIN","createdByName":"adan-idm-admin","createdTS":"2017-02-09T17:04:29Z","lastChangedBy":"IDM_ION_ADAPTER","lastChangedByName":"IDM_ION_ADAPTER","lastChangedTS":"2017-02-13T11:45:52Z","filename":"12-13-16 Windows 10 Quick Start Guide 1.0 12-13-16  (1).pdf","size":"1320403","pid":"MDS_File-3-20-LATEST","id":"3","version":"20","reprItem":"MDS_Name","displayName":"File name","entityName":"MDS_File","attrs":{"attr":[{"name":"MDS_Name","type":"1","qual":"MDS_Name","value":"File name"},{"name":"MDS_Status","type":"3","qual":"MDS_Status","value":"20"}]},"resrs":{"res":[]},"acl":{"name":"Public"}}]}};

    mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: mockResponse,
        status: 200
      })));
    });

    service
      .search("/MDS_File", 0, 10)
      .subscribe((items) => {
          expect(items).toBe(mockResponse.items);
          //console.log('Mocked http request', items, mockResponse.items);
        }), 
      err => console.log(`Here There was an error getting a specific item:${err}`);
  })));
});
