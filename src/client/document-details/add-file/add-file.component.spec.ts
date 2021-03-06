import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { AddFileComponent } from 'client/document-details/add-file/add-file.component';
import { Item } from 'models';
import { ItemService, ItemServiceMock } from 'services';
import { ItemUtility } from 'utility';

describe('AddFileComponent', () => {
  let fixture: ComponentFixture<AddFileComponent>;
  let component: AddFileComponent;
  let itemService: ItemService;

  const testItem: Item = ItemServiceMock.getMockItem();

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(AddFileComponent);
    component = fixture.componentInstance;
    itemService = fixture.debugElement.injector.get(ItemService);
  });

  beforeEach(() => {
    component.item = testItem;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('Should display file properties', () => {
    component.ngOnChanges();
    expect(component.filename).toEqual(testItem.resrs.res[0].filename);
    expect(component.size).toEqual('1.26 MB');
  });
});
