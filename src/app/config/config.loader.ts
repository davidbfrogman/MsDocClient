import { Injectable, Injector } from '@angular/core';
import { URLSearchParams } from "@angular/http";
import { Property, TranslationDictionary } from 'models';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigurationEventBus } from 'event-buses';
import { ConfigurationService, Locale, TranslationService, Translator } from 'services';

export function ConfigurationLoader(
    locale: Locale,
    translationService: TranslationService,
    translator: Translator,
    configurationService: ConfigurationService,
    configurationEventBus: ConfigurationEventBus
) {
    return () => {
        const configurationServiceProperties$: Observable<Property[]> = configurationService.properties();
        configurationService.properties().subscribe((properties: Property[]) => {
            configurationEventBus.setProperties(properties['property']);
        });
        return configurationServiceProperties$.toPromise();
    }
}

export function TranslationLoader(
    locale: Locale,
    translationService: TranslationService,
    translator: Translator,
    configurationService: ConfigurationService,
    configurationEventBus: ConfigurationEventBus
) {
    return () => {
        const language: string = locale.detectLocale(new URLSearchParams(window.location.search.substring(1)));
        const translationsBasedOnLocal$: Observable<TranslationDictionary> = translationService.translations(language);
        translationsBasedOnLocal$.subscribe((translationDictionary: TranslationDictionary) => {
            translator
                .setCurrentLocale(language)
                .setTranslationDictionary(translationDictionary);
        });
        return translationsBasedOnLocal$.toPromise();
    }
}