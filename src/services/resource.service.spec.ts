import { TestBed, inject, async } from '@angular/core/testing';
import { HttpModule, Http, BaseRequestOptions, Response, ResponseOptions, Headers } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResourceService } from './resource.service';

import { CacheEventBus } from 'event-buses';
import { ResourceResponse } from 'services/mock';

describe('ResourceService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ResourceService,
        MockBackend,
        BaseRequestOptions,
        CacheEventBus,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should construct itself', inject([ResourceService], (service: ResourceService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable<ResourceData>', async(
    inject([ResourceService, MockBackend], (service: ResourceService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(ResourceResponse);
      });

      service
        .getResourceStream('MDS_File-1-4-Latest', 'Preview')
        .subscribe((resourceData) => {
          expect(resourceData).toBeTruthy();
          expect(resourceData.filename).toBe('Preview.png');
          expect(resourceData.mimeType).toBe('image/png');
          expect(resourceData.data).toBeDefined();
          expect(resourceData.httpStatus).toBe(200);
        });
    })
  ));

});
