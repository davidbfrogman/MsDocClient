import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { EnvironmentType } from 'enumerations';

@Component({
  selector: 'idm-service-utility',
  templateUrl: './service-utility.component.html',
  providers: []
})
export class ServiceUtilityComponent {
  public isDevelopment: boolean = environment.environmentType === EnvironmentType.Dev;
}
