import { Injectable, Injector } from '@angular/core';
import { URLSearchParams } from "@angular/http";
import { Constants } from '../../constants';

@Injectable()
export class Locale {
    public locale: string;

    public constructor() {
        return this;
    }

    public detectLocale(urlSearchParams: URLSearchParams): string {
        let locale: string;
        
        locale = this.getMingleLocale(urlSearchParams);

        if (!this.isValid(locale)) {
            locale = this.getIdmLocale(urlSearchParams);
        }

        if (!this.isValid(locale)) {
            locale = this.getNavigatorLocale();
        }

        if (!this.isValid(locale) || this.isNotSupported(locale)) {
            locale = this.getDefaultLocale();
        }

        this.locale = locale;
        return this.locale;
    }

    private getMingleLocale(urlSearchParams: URLSearchParams): string {
        let locale: string = urlSearchParams.get('inforCurrentLanguage');
        return locale;
    }

    private getIdmLocale(urlSearchParams: URLSearchParams): string {
        let locale: string = urlSearchParams.get('$language') || urlSearchParams.get('%24language');
        return locale;
    }

    private getNavigatorLocale(){
        let languages = (<any>navigator).languages;
        let userLanguage = (<any>navigator).userLanguage;
        let locale: string = languages ? languages[0] : (navigator.language || userLanguage);
        return locale;
    }

    private isValid(language: string) {
        if (language && /^[a-z0-9-_]+$/i.test(language)) {
            return true;
        }
        return false;
    }

    private isNotSupported(language: string) {
        // Currently not supporting bidi languages
        if (language === 'ar' || language === 'he') {
            return true;
        }
        return false;
    }

    private getDefaultLocale() {
        return Constants.LOCALE_DEFAULT_LOCALE;
    }
}
