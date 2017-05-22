import { Injectable, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { TranslationDictionary } from 'models';
import { Constants, TranslationConstants } from '../../constants';
@Injectable()
export class Translator {
    private translationDictionary: TranslationDictionary;
    private urlSearchParams: URLSearchParams;
    public constants = TranslationConstants;
    public currentLocale: string;

    public constructor() {
        return this;
    }

    setCurrentLocale(locale: string) {
        this.currentLocale = locale;
        return this;
    }

    setTranslationDictionary(translationDictionary: TranslationDictionary) {
        this.translationDictionary = translationDictionary;
        return this;
    }

    translate(name: string, ...args:  any[]): string {
        if (this.translationDictionary) {
            let translation: string = this.translationDictionary[name];
            if (translation !== undefined) {
                for (let i: number = 1; i < arguments.length; i++) {
                    translation = translation.replace('{' + (i - 1) + '}', arguments[i]);
                }
            }
            if (translation !== undefined) {
                return translation;
            }
        }
        return '<Missing translation = ' + name + '>';
    }
}
