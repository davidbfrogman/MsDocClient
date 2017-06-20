import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { ResourceImageComponent } from './resource-image.component';
import { HttpModule } from '@angular/http';
import { ResourceService, ItemData } from 'services';
import { CacheEventBus, ErrorEventBus } from 'event-buses';
import { SohoBusyIndicatorDirective, SohoBusyIndicatorModule } from '@infor/sohoxi-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ResourceData200, ResourceData202 } from 'services/mock';

import { Observable } from 'rxjs/Observable';
import { ResourceData } from 'models';

describe('ResourceImageComponent', () => {
  let component: ResourceImageComponent;
  let fixture: ComponentFixture<ResourceImageComponent>;
  let resourceService: ResourceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, SohoBusyIndicatorModule ],
      declarations: [ ResourceImageComponent ],
      providers: [ CacheEventBus, ErrorEventBus ]
    });
    fixture = TestBed.createComponent(ResourceImageComponent);
    component = fixture.componentInstance;

    resourceService = fixture.debugElement.injector.get(ResourceService);
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set image url when item and type is set', fakeAsync(() => {
    // Given
    spyOn(resourceService, 'getResourceStream').and.returnValue(Observable.of(ResourceData200));
    component.item = ItemData;
    component.type = 'Preview';

    // Change detection is only working when it's triggered from markup/html
    // So if you change the item through the data programatically, ngOnchanges won't get triggered.
    component.ngOnChanges();
    tick(50);
    // Then
    expect(resourceService.getResourceStream).toHaveBeenCalledTimes(1);
    expect(component.imgUrl).toBeDefined();

  }));

  it('should retry fetch 3 times when the image is not ready', fakeAsync(() => {
    // Given
    spyOn(resourceService, 'getResourceStream').and.returnValue(Observable.of(ResourceData202));
    component.item = ItemData;
    component.type = 'Preview';
    component.delayBetweenRetries = 0;

    // Change detection is only working when it's triggered from markup/html
    // So if you change the item through the data programatically, ngOnchanges won't get triggered.
    component.ngOnChanges();
    tick(50);

    // Then
    expect(resourceService.getResourceStream).toHaveBeenCalledTimes(4);
  }));
});
