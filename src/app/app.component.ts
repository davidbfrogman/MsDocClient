
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment'
import { ConfigurationEventBus, CacheEventBus, InfoEventBus }  from 'event-buses';
import { AppInfoModal, AppInfoAction, Property } from 'models';
import { ConfigurationService, Translator } from 'services';

@Component({
  selector: 'idm-root',
  templateUrl: './app.component.html',  
})
export class AppComponent implements OnInit  {

  private properties: Property[];

  constructor(
    private configurationService: ConfigurationService,
    private translator: Translator,
    private configurationEventBus: ConfigurationEventBus,
    private cacheEventBus: CacheEventBus,
    private infoEventBus: InfoEventBus
  ) { }

  ngOnInit() {
    this.pullConfiguration();
    this.subscribeToConfigurationChangedEvent();
    console.log(this.translator.currentLocale, this.translator.translate(this.translator.constants.LOADING));
  }

  pullConfiguration() {
    this.loadConfiguration();
    Observable.interval(1000 * environment.pullConfigurationInterval).subscribe(() => {
      this.loadConfiguration();
    });
  }

  loadConfiguration() {
    this.configurationService.properties().subscribe((properties: Property[]) => {
        this.configurationEventBus.setProperties(properties['property']);
    });
  }

  protected subscribeToConfigurationChangedEvent() {
    this.configurationEventBus.configurationChangedEvent$.subscribe((configurationEvent) => {
      this.cacheEventBus.removeAll();
      if(configurationEvent.counter > 1) {
        this.openConfigurationChangedInfoModal();
      }
    });
  }

  openConfigurationChangedInfoModal() {
    let info = new AppInfoModal();
    let alertAction = new AppInfoAction();

    info.title = 'Configuration changed';
    info.message = 'Application configuration changed.';
    alertAction.text = "Reload application";
    alertAction.run = () => location.reload();
    info.actions = [alertAction];
    
    this.infoEventBus.throwModal(info);
  }
}
