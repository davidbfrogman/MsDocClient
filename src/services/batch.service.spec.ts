
import {} from 'jasmine';
import { HttpModule, Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { TestBed, async, inject } from '@angular/core/testing';
import { Item } from '../models';
import { BatchService } from './';
import { CacheEventBus } from 'event-buses';
import { BatchOperationsData } from 'services/mock';

describe('BatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        CacheEventBus,
        BatchService,
        MockBackend,
        BaseRequestOptions,
        { provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should ...', inject([BatchService], (service: BatchService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable<BatchOperations>>', async(
    inject([BatchService, MockBackend], (service: BatchService, mockBackend: MockBackend) => {
    const mockResponse = BatchOperationsData;

    mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: mockResponse,
        status: 200
      })));
    });

    const items: Item[] = [
        <Item> {pid: 'MDS_File-1'},
        <Item> {pid: 'MDS_File-2'},
        <Item> {pid: 'MDS_File-3'}
    ];

    service
        .checkInItems(items)
        .subscribe((batchOperations) => {
            expect(batchOperations).toBe(mockResponse.batchOperations.batchOperation);
        });
  })));
});
