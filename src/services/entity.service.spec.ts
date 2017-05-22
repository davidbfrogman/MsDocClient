import { } from 'jasmine';
import { HttpModule, Http, BaseRequestOptions, XHRBackend, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { EntitiesWithAttributes } from './mock/mock-data/entities-with-attributes.data';
import 'rxjs/add/operator/map';
import { EntityService } from 'services';
import { Entity } from 'models';
import { CacheEventBus } from 'event-buses';

describe('EntityService', () => {
  let entityService: EntityService;
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        CacheEventBus,
        EntityService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  beforeEach(inject([EntityService, MockBackend], (service: EntityService, mbe: MockBackend) => {
    entityService = service;
    mockBackend = mbe;
  }));

  it('should contstuct itself', () => {
    expect(entityService).toBeTruthy();
  });

  it('should return an Observable<Array<Entitys>> when searching', async(() => {
    const mockResponse = EntitiesWithAttributes

    mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: mockResponse,
        status: 200
      })));
    });

    entityService.getList<Entity>(null)
      .subscribe((entities) => {
        expect(entities).toBeTruthy();
        expect(entities.length).toBeGreaterThan(0);
        expect(entities[0].attrs).toBeTruthy();
        expect(entities[0].attrs.attr.length).toBeGreaterThan(0);
      }),
      err => console.log(`There was an error getting Entitys:${err}`);
  }));

});

