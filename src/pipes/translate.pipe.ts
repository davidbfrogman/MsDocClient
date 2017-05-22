import { Pipe, PipeTransform } from '@angular/core';
import { Translator } from 'services'; // our translate service
import { TranslationConstants } from '../constants';

@Pipe({
    name: 'translate',
    pure: false // impure pipe, update value when we change language
})

export class TranslatePipe implements PipeTransform {
	public constants = TranslationConstants;
	
	constructor(private translation: Translator) { }

	public transform(value: string, args?: string | string[]): any {
		if (!value) return '';
		
		return this.translation.translate(value, args);
	}
}