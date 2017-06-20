import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler  } from '@angular/core';
import { AppErrorHandler } from './app.error-handler';
import { HttpModule } from '@angular/http';
import { SohoIconModule} from '@infor/sohoxi-angular';
import { SohoComponentsModule } from '@infor/sohoxi-angular';
import { AppRoutes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './not-found.component';
import { ClientModule } from '../client/client.module';
import { RelatedinformationModule } from '../relatedinformation/relatedinformation.module';
import { SharedClientModule } from '../client/shared-client/shared-client.module';
import { ConfigurationEventBus, CacheEventBus, ErrorEventBus, InfoEventBus } from 'event-buses';
import { ConfigurationService, ResultListConfigService, BatchService,
         EntityService, ItemService,
         Locale, TranslationService,
         UserService, Translator } from 'services';
import {
  ConfigurationLoader,
  TranslationLoader,
  TRANSLATOR_PROVIDER,
  RESULTLIST_CONFIGURATOR_PROVIDER,
  CONFIGURATION_LOADER_PROVIDER,
  TRANSLATION_LOADER_PROVIDER,
  RESULTLIST_LOADER_PROVIDER,
  ENTITY_LOADER_PROVIDER,
  ENTITY_CONFIGURATOR_PROVIDER
} from './config/config.loader';

import { PipesModule } from 'pipes/pipes.module';
import { TranslatePipe } from 'pipes/translate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    AppRoutes,
    ClientModule,
    RelatedinformationModule,
    SohoIconModule,
    ReactiveFormsModule,
    FormsModule,
    SharedClientModule,
    SohoComponentsModule,
    PipesModule,
  ],
  providers: [
    ConfigurationEventBus,
    ConfigurationService,
    ResultListConfigService,
    Locale,
    TranslationService,
    Translator,
    CacheEventBus,
    ErrorEventBus,
    InfoEventBus,
    BatchService,
    EntityService,
    ItemService,
    UserService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    CONFIGURATION_LOADER_PROVIDER,
    TRANSLATOR_PROVIDER,
    TRANSLATION_LOADER_PROVIDER,
    RESULTLIST_CONFIGURATOR_PROVIDER,
    RESULTLIST_LOADER_PROVIDER,
    ENTITY_CONFIGURATOR_PROVIDER,
    ENTITY_LOADER_PROVIDER
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
