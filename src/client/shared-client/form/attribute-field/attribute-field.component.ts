import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { Attribute, Valueset } from 'models';
import { AttributeUtility } from 'utility';
import { BaseControlValueAccessor, provideControlValueAccessor } from '../';
import * as moment from 'moment';

@Component({
  selector: 'idm-attribute-field',
  templateUrl: './attribute-field.component.html',
  styleUrls: ['./attribute-field.component.scss']
})
export class AttributeFieldComponent implements OnChanges {
  @Input() editable: boolean;
  @Input() attribute: Attribute;
  @Input() placeholder: string;
  @Input() disabled: boolean;

  public name: string;
  public type: number;
  public maxlength: string;
  public required: boolean;
  public unique: boolean;
  public valueset: Valueset;
  public value: string;

  ngOnChanges() {
    this.computeFieldType();
  }

  protected computeFieldType() {
    this.name = this.attribute.qual;
    this.type = AttributeUtility.getFormFieldType(this.attribute);
    this.maxlength = AttributeUtility.getMaxlength(this.attribute);
    this.required = AttributeUtility.getRequired(this.attribute);
    this.unique = AttributeUtility.getUnique(this.attribute);
    this.value = AttributeUtility.getFormValue(this.attribute);
    this.valueset = AttributeUtility.getValueset(this.attribute);
  }

  onChange(event: Event) {
    this.attribute.value = AttributeUtility.getApiValue(this.attribute, this.value);
  }
}
