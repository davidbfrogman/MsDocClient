import { TestingModule } from 'testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from 'client/shared-client';
import { FormFieldType } from 'enumerations';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the readonly String field', fakeAsync(() => {
    component.name = 'string';
    component.placeholder = 'placeholder';
    component.type = FormFieldType.String;
    component.editable = false;
    component.ngOnChanges();
    expect(component.showString).toEqual(false);
    expect(component.showReadonly).toEqual(true);
  }));

  it('should create the String field', fakeAsync(() => {
    component.name = 'String';
    component.placeholder = 'placeholder';
    component.type = FormFieldType.String;
    component.editable = true;
    component.ngOnChanges();
    expect(component.showString).toEqual(true);
    expect(component.showReadonly).toEqual(false);
  }));

  it('should create the Number field', fakeAsync(() => {
    component.name = 'Number';
    component.placeholder = 'placeholder';
    component.type = FormFieldType.Number;
    component.editable = true;
    component.ngOnChanges();
    expect(component.showNumber).toEqual(true);
    expect(component.showReadonly).toEqual(false);
  }));

  it('should create the Boolean field', fakeAsync(() => {
    component.name = 'Boolean';
    component.placeholder = 'placeholder';
    component.type = FormFieldType.Boolean;
    component.editable = true;
    component.ngOnChanges();
    expect(component.showBoolean).toEqual(true);
    expect(component.showReadonly).toEqual(false);
  }));

  it('should create the DropDown field', fakeAsync(() => {
    component.name = 'DropDown';
    component.placeholder = 'placeholder';
    component.type = FormFieldType.Dropdown;
    component.editable = true;
    component.ngOnChanges();
    expect(component.showDropdown).toEqual(true);
    expect(component.showReadonly).toEqual(false);
  }));

  it('should create the DatePicker field', fakeAsync(() => {
    component.name = 'DatePicker';
    component.placeholder = 'placeholder';
    component.type = FormFieldType.DatePicker;
    component.editable = true;
    component.ngOnChanges();
    expect(component.showDatePicker).toEqual(true);
    expect(component.showReadonly).toEqual(false);
  }));

  it('should create the TimePicker field', fakeAsync(() => {
    component.name = 'TimePicker';
    component.placeholder = 'placeholder';
    component.type = FormFieldType.TimePicker;
    component.editable = true;
    component.ngOnChanges();
    expect(component.showTimePicker).toEqual(true);
    expect(component.showReadonly).toEqual(false);
  }));

  it('should create the DateTimePicker field', fakeAsync(() => {
    component.name = 'DateTimePicker';
    component.placeholder = 'placeholder';
    component.type = FormFieldType.DateTimePicker;
    component.editable = true;
    component.ngOnChanges();
    expect(component.showDateTimePicker).toEqual(true);
    expect(component.showReadonly).toEqual(false);
  }));

});
