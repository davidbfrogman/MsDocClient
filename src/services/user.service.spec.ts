import { } from 'jasmine';
import { HttpModule, Http, BaseRequestOptions, XHRBackend, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { UsersWithEmails } from './mock/mock-data/users-with-emails.data';
import 'rxjs/add/operator/map';
import { UserService } from 'services';
import { CacheEventBus } from 'event-buses';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        CacheEventBus,
        UserService,
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
  });

  it('should contstuct itself', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable<Array<Users>> when searching', async(
    inject([UserService, MockBackend], (service: UserService, mockBackend: MockBackend) => {
      const mockResponse = UsersWithEmails;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse,
          status: 200
        })));
      });

      service
        .search('dbrown', 20)
        .subscribe((users) => {
          expect(users).toBeTruthy();
          expect(users.length).toBeGreaterThan(0);
        });
    })));
});

