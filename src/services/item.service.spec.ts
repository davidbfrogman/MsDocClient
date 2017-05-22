
import {} from 'jasmine';
import { HttpModule, Http, BaseRequestOptions, XHRBackend, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { Item } from '../models';
import { ItemService } from './';
import { CacheEventBus } from 'event-buses';
import { ItemsXQueryData } from 'services/mock';

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
    const mockResponse = ItemsXQueryData;

    mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: mockResponse,
        status: 200
      })));
    });

    service
      .search('/MDS_File', 0, 10)
      .subscribe((items) => {
          expect(items).toBe(mockResponse.items);
        });
  })));
});
