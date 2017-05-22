import { Injectable, Injector } from '@angular/core';
import { URLSearchParams } from "@angular/http";
import { TranslationDictionary } from 'models';
import { Constants, TranslationConstants } from '../../constants';
import { TranslationDictionaryData } from 'services/mock';
import { Translator } from 'services';

@Injectable()
export class TranslatorMock extends Translator {
    public constructor() {
        super();
        const translationDictionaryMock = new TranslationDictionaryData();
        this
            .setCurrentLocale('en')
            .setTranslationDictionary(translationDictionaryMock);
        return this;
    }
}
