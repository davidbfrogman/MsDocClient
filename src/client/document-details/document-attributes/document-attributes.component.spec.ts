import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { DocumentAttributesComponent } from './document-attributes.component';
import { ItemData, ItemDataInternalAtrributes } from 'services';

describe('DocumentAttributesComponent', () => {
  let fixture: ComponentFixture<DocumentAttributesComponent>;
  let component: DocumentAttributesComponent;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(DocumentAttributesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should initialize internal components', () => {
    component.item = ItemData;
    component.ngOnChanges();
    expect(component.isItemEditable).toBeFalsy();
    expect(component.attributes.length).toEqual(ItemData.attrs.attr.length);

    component.attributes.forEach(attribute => {
      expect(attribute.attributeType).toBeDefined();
      expect(attribute.isAttributeTypeMapped).toBeTruthy();
    });
  });

  it('should recognize internal attributes', () => {
    component.item = ItemData;
    component.ngOnChanges();

    ItemDataInternalAtrributes.forEach(attribute => {
      expect(component.attributeVisible(attribute)).toBeFalsy();
    });
    expect(component.attributeVisible(component.attributes[0])).toBeTruthy();
  });
});
