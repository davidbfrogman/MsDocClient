
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'idm-icons',
  templateUrl: '../../assets/icons/idm-svg-icons.html',
})
export class IdmIconsComponent {
  @HostBinding('style.display') none = 'none';
}
