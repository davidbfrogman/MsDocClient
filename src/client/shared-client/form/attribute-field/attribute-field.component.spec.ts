import { TestingModule } from 'testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeFieldComponent } from 'client/shared-client';
import { Attribute } from 'models';
import { FormFieldType } from 'enumerations';
import { EntitiesWithAttributes } from 'services/mock';
import { AttributeUtility } from 'utility';

describe('AttributeFieldComponent', () => {
  let component: AttributeFieldComponent;
  let fixture: ComponentFixture<AttributeFieldComponent>;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(AttributeFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should create component using String attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[5];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = 'valueString';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.String);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using String attribute with default value', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[6];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = undefined;
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.String);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.default);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using String attribute with max size', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[7];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = 'valueString';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.String);
  //   expect(component.maxlength).toEqual(attribute.size);
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using String attribute required', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[8];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = 'valueString';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.String);
  //   expect(component.required).toEqual(true);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using String attribute unique', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[9];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = 'valueString';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.String);
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(true);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using attribute with valueset', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[1].attrs.attr[1];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = '5';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.Dropdown);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toEqual(attribute.valueset);
  // });

  // it('should create component using Boolean attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[12];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = 'true';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.Boolean);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using Date attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[13];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = '2014-01-01';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.DatePicker);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using Timestamp attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[14];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = '2014-01-01T10:12:23Z';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.DateTimePicker);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual('2014-01-01 10:12:23');
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using Time attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[3].attrs.attr[15];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = '10:12:23Z';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.TimePicker);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual('10:12:23');
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using Decimal attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[2].attrs.attr[5];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = '11.12';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.Number);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using Double attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[2].attrs.attr[6];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = '123456789';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.Number);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using Long attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[2].attrs.attr[7];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = '1937354';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.Number);
  //   expect(component.maxlength).toBeUndefined();
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

  // it('should create component using Short attribute', () => {
  //   const attribute: Attribute = EntitiesWithAttributes.entities.entity[2].attrs.attr[8];
  //   AttributeUtility.mapAttributeTypeEnumeration(attribute);
  //   attribute.value = '2';
  //   component.attribute = attribute;
  //   component.editable = true;
  //   component.ngOnChanges();
  //   expect(component.name).toEqual(attribute.qual);
  //   expect(component.type).toEqual(FormFieldType.Number);
  //   expect(component.required).toEqual(false);
  //   expect(component.unique).toEqual(false);
  //   expect(component.value).toEqual(attribute.value);
  //   expect(component.valueset).toBeUndefined();
  // });

});
