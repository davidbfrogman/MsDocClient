import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { DocumentDetailsModule } from '../document-details.module';

import { DocumentDetailTabsComponent } from './document-detail-tabs.component';
import { Item, Entity, Acl } from 'models';
import { EntityServiceMock, ItemService, ItemServiceMock } from 'services';

describe('DocumentDetailTabsComponent', () => {
  let fixture: ComponentFixture<DocumentDetailTabsComponent>;
  let component: DocumentDetailTabsComponent;
  let compiled: any;
  const testItem: Item = ItemServiceMock.getMockItem();
  const testEntity: Entity = EntityServiceMock.getMockEntity();

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(DocumentDetailTabsComponent);
    component = fixture.componentInstance;
    component.entity = testEntity;
    component.item = testItem;
    fixture.detectChanges();
    component.ngOnInit();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('Should display ACL options per test Entity::Acls::Acl[]', () => {
    expect(component.acls[0].name).toEqual('Public');
    expect(component.acls[1].name).toEqual('Private');
  });

  it('Should update model on ACL list select', () => {
    const select = fixture.debugElement.query(By.css('select[id^=acl-dropdown]'));
    const option = select.query(By.css('option'));
    option.nativeElement.selected = true;
    select.nativeElement.dispatchEvent(new Event('change'));

    fixture.whenStable().then(() => {
      expect(component.item.acl.name).toEqual(option.nativeElement.textContent);
    });
  });
});
