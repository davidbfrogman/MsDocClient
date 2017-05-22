import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { TestingModule } from 'testing';

import { AddDocumentComponent } from './add-document.component';
import { ItemService, EntityService, ItemData, EntityData } from 'services';
import { DocumentsEventBus } from 'event-buses';
import { Item, Acl } from 'models';

describe('AddDocumentComponent', () => {
  let component: AddDocumentComponent;
  let fixture: ComponentFixture<AddDocumentComponent>;
  let documentsEventBus: DocumentsEventBus;
  let entityService: EntityService;
  let itemService: ItemService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(AddDocumentComponent);
    component = fixture.componentInstance;
    itemService = fixture.debugElement.injector.get(ItemService);
    entityService = fixture.debugElement.injector.get(EntityService);
    documentsEventBus = fixture.debugElement.injector.get(DocumentsEventBus);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the api to get entities', fakeAsync(() => {
    spyOn(entityService, 'getList').and.callThrough();
    component.populateEntitiesList();
    tick();
    expect(entityService.getList).toHaveBeenCalled();
    expect(entityService.getList).toHaveBeenCalledTimes(1);
  }));

  it('should populate the entities list', fakeAsync(() => {
    spyOn(entityService, 'getList').and.callThrough();
    component.populateEntitiesList();
    tick();
    expect(component.entityList).toBeTruthy();
    expect(component.entityList.length).toBeGreaterThan(0);
  }));

  it('should populate the document templates list when an entity is selected', () => {
    component.populateEntitiesList();
    component.onEntitySelected(component.entityList[2]);
    expect(component.templateList).toBeDefined();
    expect(component.templateList.length).toBeGreaterThan(0);
  });

  it('should select document type', () => {
    component.onEntitySelected(EntityData);
    expect(component.templateList).toBeDefined();
    expect(component.templateList.length).toBeGreaterThan(0);
    expect(component.templateList[0] instanceof Item).toBeTruthy();
    expect(component.templateList[0].acl instanceof Acl).toBeTruthy();
    expect(component.isDocumentSelected).toBeTruthy();
    expect(component.isSaveEnabled).toBeTruthy();
  });

  it('should select template', () => {
    component.onItemSelected(ItemData);
    expect(component.isSaveEnabled).toBeTruthy();
    expect(component.selectedTemplate).toBe(ItemData);
  });

  it('should open document', () => {
    let clickEvent = new ClickEvent();
    spyOn(clickEvent, 'preventDefault');
    spyOn(clickEvent, 'stopPropagation');
    spyOn(documentsEventBus, 'closeDocumentModal');

    component.onItemOpened(clickEvent, ItemData);
    expect(clickEvent.preventDefault).toHaveBeenCalled();
    expect(clickEvent.stopPropagation).toHaveBeenCalled();
    expect(documentsEventBus.closeDocumentModal).toHaveBeenCalled();
  });

});

class ClickEvent {
  preventDefault(): void { };
  stopPropagation(): void { };
}
