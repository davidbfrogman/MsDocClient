import {} from 'jasmine';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgModule, ErrorHandler, APP_INITIALIZER  } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import { HttpModule } from '@angular/http';
import { SohoIconModule} from '@infor/sohoxi-angular';
import { SohoComponentsModule } from '@infor/sohoxi-angular';
import { AppRoutes } from '../app/app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientModule } from '../client/client.module';
import { DocumentDetailsModule } from '../client/document-details/document-details.module';
import { RelatedinformationModule } from '../relatedinformation/relatedinformation.module';
import { SharedClientModule } from '../client/shared-client/shared-client.module';
import { PipesModule } from 'pipes/pipes.module';
import {
  ConfigurationEventBus, CacheEventBus, ErrorEventBus,
  InfoEventBus, ItemTabsEventBus, ViewSelectorEventBus
} from 'event-buses';
import {
  ConfigurationService, ConfigurationServiceMock,
  EntityService, EntityServiceMock,
  ItemService, ItemServiceMock, Locale,
  TranslationService, TranslationServiceMock,
  UserService, UserServiceMock,
  Translator, TranslatorMock,
  BatchService, BatchServiceMock, EntityConfigurator, EntityConfiguratorMock, ResultListConfigurator, ResultListConfiguratorMock
} from 'services';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    AppRoutes,
    RelatedinformationModule,
    SohoIconModule,
    ReactiveFormsModule,
    FormsModule,
    SharedClientModule,
    ClientModule,
    DocumentDetailsModule,
    SohoComponentsModule,
    PipesModule
  ],
  providers: [
    ConfigurationEventBus,
    CacheEventBus,
    ErrorEventBus,
    InfoEventBus,
    ItemTabsEventBus,
    ViewSelectorEventBus,
    { provide: ConfigurationService,  useClass: ConfigurationServiceMock },
    { provide: EntityService, useClass: EntityServiceMock },
    { provide: ItemService, useClass: ItemServiceMock },
    { provide: TranslationService, useClass: TranslationServiceMock },
    { provide: Translator, useClass: TranslatorMock },
    { provide: EntityConfigurator, useClass: EntityConfiguratorMock },
    { provide: ResultListConfigurator, useClass: ResultListConfiguratorMock },
    { provide: UserService, useClass: UserServiceMock },
    { provide: BatchService, useClass: BatchServiceMock},
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  exports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    RelatedinformationModule,
    SohoIconModule,
    ReactiveFormsModule,
    FormsModule,
    SharedClientModule,
    SohoComponentsModule,
    PipesModule
  ],
  bootstrap: [],
})
export class TestingModule { }
