import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidatedDirective } from './validator.directive';
import { FormFieldType } from 'enumerations';
import { TranslationConstants } from '../../../constants';

declare var jQuery: any;

@Component({
  template: '<input datatype="{{ type }}" maxlength="10" validated>'
})
class ValidatedComponent {
  public type: string;
}

describe('Validated', () => {
  let component: ValidatedComponent;
  let fixture: ComponentFixture<ValidatedComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [ ],
      declarations: [ ValidatedComponent, ValidatedDirective ],
      providers: [ ]
    }).createComponent(ValidatedComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should register time picker validator', () => {
    component.type = FormFieldType.TimePicker.toString();
    fixture.detectChanges();
    expect(jQuery.fn.validation.rules.time).toBeDefined();
    expect(jQuery.fn.validation.rules.time.message).toEqual(TranslationConstants.ERROR_INVALID_TIME);
    expect(jQuery.fn.validation.rules.time.check('invalid')).toBeFalsy();
    expect(jQuery.fn.validation.rules.time.check('00:00:00')).toBeTruthy();
  });

  it('should register string validator', () => {
    component.type = FormFieldType.String.toString();
    fixture.detectChanges();
    expect(jQuery.fn.validation.rules.string).toBeDefined();
    expect(jQuery.fn.validation.rules.string.message).toEqual(TranslationConstants.ERROR_STRING_LONG);
    expect(jQuery.fn.validation.rules.string.check('Lorem Ipsum')).toBeFalsy();
    expect(jQuery.fn.validation.rules.string.check('Lorem')).toBeTruthy();
  });

  it('should register number validator', () => {
    component.type = FormFieldType.Number.toString();
    fixture.detectChanges();
    expect(jQuery.fn.validation.rules.number).toBeDefined();
    expect(jQuery.fn.validation.rules.number.message).toEqual(TranslationConstants.ERROR_INVALID_NUMBER);
    expect(jQuery.fn.validation.rules.number.check(undefined)).toBeFalsy();
    expect(jQuery.fn.validation.rules.number.check(123)).toBeTruthy();
  });
});
