import { Directive, ElementRef, OnChanges, Input } from '@angular/core';
import { FormFieldType } from 'enumerations';
import { ValidationRule, ValidationRuleDefinition } from 'models';
import { TranslationConstants } from '../../../constants';

declare var jQuery: any;

@Directive({
  /* tslint:disable */
  selector: '[validated]'
  /* tslint:enable */
})
export class ValidatedDirective implements OnChanges {

  @Input() datatype: string;
  @Input() maxlength: string;

  public validationRules: ValidationRule;

  constructor(private elementRef: ElementRef) {
    this.validationRules = jQuery.fn.validation.rules;
  }

  ngOnChanges() {
    switch (Number(this.datatype)) {
      case FormFieldType.TimePicker:
        this.addTimeValidationRule();
        break;
      case FormFieldType.Number:
        this.addNumberValidationRule();
        break;
      case FormFieldType.String:
        this.addStringValidationRule();
        break;
    }
  }

  private addNumberValidationRule(): void {
    this.validationRules.number = <ValidationRuleDefinition>{
      check(value): boolean {
        const empty = !value || value.length < 1;
        return !empty && /^\d{0,}$/.test(value);
      },
      message: TranslationConstants.ERROR_INVALID_NUMBER
    };
  }

  private addTimeValidationRule(): void {
    this.validationRules.time = <ValidationRuleDefinition>{
      check: (value): boolean => {
        return /^\d{1,2}:\d{2}:\d{2}$/.test(value);
      },
      message: TranslationConstants.ERROR_INVALID_TIME
    };
  }

  private addStringValidationRule(): void {
    this.validationRules.string = <ValidationRuleDefinition>{
      check: ((value) => {
        let length = 0;
        if (value) {
          length = value.length;
        }
        if (this.maxlength && length > Number(this.maxlength)) {
          return false;
        }
        return true;
      }).bind(this),
      message: TranslationConstants.ERROR_STRING_LONG
    };
  }
}
