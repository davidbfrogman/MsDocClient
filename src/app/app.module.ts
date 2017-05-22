import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER  } from '@angular/core';
import { AppErrorHandler } from './app.error-handler';
import { HttpModule } from '@angular/http';
import { SohoIconModule} from '@infor/sohoxi-angular';
import { SohoComponentsModule } from '@infor/sohoxi-angular';
import { AppRoutes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error.component';
import { PageNotFoundComponent } from './not-found.component';
import { ClientModule } from '../client/client.module';
import { RelatedinformationModule } from '../relatedinformation/relatedinformation.module';
import { SharedClientModule } from '../client/shared-client/shared-client.module';
import { ConfigurationEventBus, CacheEventBus, ErrorEventBus, InfoEventBus } from 'event-buses';
import { ConfigurationService, EntityService, ItemService, Locale, TranslationService, UserService, Translator } from 'services';
import { ConfigurationLoader, TranslationLoader } from './config/config.loader';
import { PipesModule } from 'pipes/pipes.module';
import { TranslatePipe } from 'pipes/translate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
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
    Locale,
    TranslationService,
    Translator,
    CacheEventBus,
    ErrorEventBus,
    InfoEventBus,
    EntityService,
    ItemService,
    UserService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
        provide: APP_INITIALIZER,
        useFactory: ConfigurationLoader,
        deps: [Locale, TranslationService, Translator, ConfigurationService, ConfigurationEventBus],
        multi: true
    },
    {
        provide: APP_INITIALIZER,
        useFactory: TranslationLoader,
        deps: [Locale, TranslationService, Translator, ConfigurationService, ConfigurationEventBus],
        multi: true
    }
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
