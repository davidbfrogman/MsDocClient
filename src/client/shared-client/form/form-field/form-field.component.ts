import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  OnDestroy,
  Input,
  Output,
  OnChanges,
  ViewChild
} from '@angular/core';
import { SohoDatePickerComponent, SohoTimePickerComponent } from '@infor/sohoxi-angular';
import { Constants } from '../../../../constants';
import { FormFieldType, AttributeType, OperationType, SearchStyleType } from 'enumerations';
import { Attribute, Value, Valueset } from 'models';
import { AttributeUtility } from 'utility';
import { BaseControlValueAccessor, provideControlValueAccessor } from '../';
import * as moment from 'moment';

@Component({
  selector: 'idm-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  providers: [provideControlValueAccessor(FormFieldComponent)]
})
export class FormFieldComponent extends BaseControlValueAccessor<any> implements OnChanges {
  @ViewChild(SohoDatePickerComponent) datepicker: SohoDatePickerComponent;
  @ViewChild(SohoTimePickerComponent) timepicker: SohoTimePickerComponent;
  @Input() name: string;
  @Input() placeholder: string;
  @Input() type: number;
  @Input() maxlength: string;
  @Input() required: boolean;
  @Input() unique: boolean;
  @Input() editable: boolean;
  @Input() valueset: Valueset;
  @Input() disabled: boolean;

  public dataValidate: string;
  public ariaRequired: string;
  public showReadonly: boolean;
  public showString: boolean;
  public showNumber: boolean;
  public showBoolean: boolean;
  public showDropdown: boolean;
  public showDatePicker: boolean;
  public showTimePicker: boolean;
  public showDateTimePicker: boolean;
  public showUserInput: boolean;
  public SOHO_DATEPICKER_DATE_FORMAT: string = Constants.SOHO_DATEPICKER_DATE_FORMAT;
  public SOHO_DATEPICKER_TIME_FORMAT: string = Constants.SOHO_DATEPICKER_TIME_FORMAT;
  public SOHO_DATEPICKER_DATETIME_FORMAT: string = Constants.SOHO_DATEPICKER_DATETIME_FORMAT;
  public booleanValueset = AttributeUtility.getBooleanValueset();

  constructor(private element: ElementRef, private changeDetectionRef: ChangeDetectorRef) {
    super(changeDetectionRef);
  }

  ngOnChanges() {
    this.computeFieldType();
  }

  protected computeFieldType() {
    this.showReadonly = !this.editable;
    this.showString = this.getShowByFormFieldType(FormFieldType.String);
    this.showNumber = this.getShowByFormFieldType(FormFieldType.Number);
    this.showBoolean = this.getShowByFormFieldType(FormFieldType.Boolean);
    this.showDropdown = this.getShowByFormFieldType(FormFieldType.Dropdown);
    this.showDatePicker = this.getShowByFormFieldType(FormFieldType.DatePicker);
    this.showTimePicker = this.getShowByFormFieldType(FormFieldType.TimePicker);
    this.showDateTimePicker = this.getShowByFormFieldType(FormFieldType.DateTimePicker);
    this.showUserInput = this.getShowByFormFieldType(FormFieldType.User);
  }

  protected getShowByFormFieldType(formFieldType: FormFieldType) {
    return this.editable && (this.type === formFieldType);
  }

  onTimePickerChange(event: any) {
    this.value = event.target.value;
  }
}
