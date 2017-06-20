import { Injectable, Injector, APP_INITIALIZER } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Property, TranslationDictionary, ResultListConfig, Entity } from 'models';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigurationEventBus } from 'event-buses';
import { ConfigurationService, Locale, TranslationService, Translator, ResultListConfigService, ResultListConfigurator, EntityService, EntityConfigurator } from 'services';

export function ConfigurationLoader(
    configurationService: ConfigurationService,
    configurationEventBus: ConfigurationEventBus
) {
    return () => {
        const configurationServiceProperties$: Observable<Property[]> = configurationService.properties();
        configurationService.properties().subscribe((properties: Property[]) => {
            configurationEventBus.setProperties(properties['property']);
        });
        return configurationServiceProperties$.toPromise();
    };
}

export function TranslationLoader(
    locale: Locale,
    translationService: TranslationService,
    translator: Translator
) {
    return () => {
        const language: string = locale.detectLocale(new URLSearchParams(window.location.search.substring(1)));
        const translationsBasedOnLocal$: Observable<TranslationDictionary> = translationService.translations(language);
        translationsBasedOnLocal$.subscribe((translationDictionary: TranslationDictionary) => {
            translator
                .setCurrentLocale(language)
                .setTranslationDictionary(translationDictionary);
        });
        Translator.getInstance();
        return translationsBasedOnLocal$.toPromise();
    };
}

export function ResultListLoader(
    resultListConfigService: ResultListConfigService,
    resultListConfigurator: ResultListConfigurator
) {
    return () => {
        const resultListConfig$: Observable<ResultListConfig[]> = resultListConfigService.resultList();
        resultListConfig$.subscribe((resultListConfigs: ResultListConfig[]) => {
            if(resultListConfigs && resultListConfigs['resultList']) {
                resultListConfigurator.setResultListConfig(resultListConfigs['resultList']);
            }
        });
        ResultListConfigurator.getInstance();
        return resultListConfig$.toPromise();
    };
}

export function EntityLoader(
    entityService: EntityService,
    entityConfigurator: EntityConfigurator
) {
    return () => {
        const entities$: Observable<Entity[]> = entityService.getList();
        entities$.subscribe((entities: Entity[]) => {
            if(entities) {
                entityConfigurator.setEntities(entities);
            }
        });
        EntityConfigurator.getInstance();
        return entities$.toPromise();
    };
}

export function TranslationInstance() {
    return Translator.getInstance();
}

export function ResultListConfiguratorInstance() {
    return ResultListConfigurator.getInstance();
}

export function EntityConfiguratorInstance() {
    return EntityConfigurator.getInstance();
}

export const TRANSLATOR_PROVIDER = {
  provide: Translator,
  useFactory: TranslationInstance
};

export const RESULTLIST_CONFIGURATOR_PROVIDER = {
  provide: ResultListConfigurator,
  useFactory: ResultListConfiguratorInstance
};

export const ENTITY_CONFIGURATOR_PROVIDER = {
  provide: EntityConfigurator,
  useFactory: EntityConfiguratorInstance
};

export const CONFIGURATION_LOADER_PROVIDER = {
    provide: APP_INITIALIZER,
    useFactory: ConfigurationLoader,
    deps: [ConfigurationService, ConfigurationEventBus],
    multi: true
};

export const TRANSLATION_LOADER_PROVIDER = {
    provide: APP_INITIALIZER,
    useFactory: TranslationLoader,
    deps: [Locale, TranslationService, Translator],
    multi: true
};

export const RESULTLIST_LOADER_PROVIDER = {
    provide: APP_INITIALIZER,
    useFactory: ResultListLoader,
    deps: [ResultListConfigService, ResultListConfigurator],
    multi: true
};

export const ENTITY_LOADER_PROVIDER = {
    provide: APP_INITIALIZER,
    useFactory: EntityLoader,
    deps: [EntityService, EntityConfigurator],
    multi: true
};
