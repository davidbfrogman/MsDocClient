import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { ResourceImageComponent } from './resource-image.component';
import { HttpModule } from '@angular/http';
import { ResourceService, ItemData } from 'services';
import { CacheEventBus, ErrorEventBus, ResourceQueueEventBus } from 'event-buses';
import { SohoBusyIndicatorDirective, SohoBusyIndicatorModule } from '@infor/sohoxi-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ResourceData200, ResourceData202 } from 'services/mock';

import { Observable } from 'rxjs/Observable';
import { ResourceData } from 'models';

describe('ResourceImageComponent', () => {
  let component: ResourceImageComponent;
  let fixture: ComponentFixture<ResourceImageComponent>;
  let resourceService: ResourceService;
  let resourceQueueEventBus: ResourceQueueEventBus;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, SohoBusyIndicatorModule ],
      declarations: [ ResourceImageComponent ],
      providers: [ CacheEventBus, ErrorEventBus, ResourceQueueEventBus ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ResourceImageComponent);
    component = fixture.componentInstance;
    // Get the resourceService with recommended method:
    // https://angular.io/docs/ts/latest/guide/testing.html#!#get-injected-service
    resourceService = fixture.debugElement.injector.get(ResourceService);
    resourceQueueEventBus = fixture.debugElement.injector.get(ResourceQueueEventBus);
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set image url when item and type is set', fakeAsync(() => {
    // Given
    spyOn(resourceService, 'getResourceStream').and.returnValue(Observable.of(ResourceData200));
    component.item = ItemData;
    component.type = 'Preview';

    // When
    fixture.detectChanges();
    tick(1000); // https://github.com/angular/angular/issues/8251

    // Then
    expect(resourceService.getResourceStream).toHaveBeenCalledTimes(1);
    expect(component.imgUrl).toBeDefined();

  }));

  it('should should use the queue when useQueue is set', fakeAsync(() => {
    // Given
    spyOn(resourceService, 'getResourceStream').and.returnValue(Observable.of(ResourceData200));
    spyOn(resourceQueueEventBus, 'addImage').and.callThrough();
    component.item = ItemData;
    component.type = 'Preview';
    component.useQueue = true;

    // When
    fixture.detectChanges();
    tick(1000);

    // Then
    expect(resourceService.getResourceStream).toHaveBeenCalledTimes(1);
    expect(resourceQueueEventBus.addImage).toHaveBeenCalledTimes(1);
    expect(component.imgUrl).toBeDefined();
  }));

  it('should retry fetch 3 times when the image is not ready', fakeAsync(() => {
    // Given
    spyOn(resourceService, 'getResourceStream').and.returnValue(Observable.of(ResourceData202));
    component.item = ItemData;
    component.type = 'Preview';

    // When
    fixture.detectChanges();
    tick(20000);

    // Then
    expect(resourceService.getResourceStream).toHaveBeenCalledTimes(4);
  }));

  it('should retry fetch 3 times when the image is not ready from queue', fakeAsync(() => {
    // Given
    spyOn(resourceService, 'getResourceStream').and.returnValue(Observable.of(ResourceData202));
    component.item = ItemData;
    component.type = 'Preview';
    component.useQueue = true;

    // When
    fixture.detectChanges();
    tick(20000); // simulate 20000 ms for all fetches to be ready

    // Then
    expect(resourceService.getResourceStream).toHaveBeenCalledTimes(4);
  }));

});
