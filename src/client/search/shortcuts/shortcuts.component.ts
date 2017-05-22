import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { XQueryEventBus } from 'event-buses';
import { Constants } from '../../../constants';
import { Translator } from 'services';

@Component({
  selector: 'idm-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
  providers: []
})
export class ShortcutsComponent {
  constructor(private xQueryEventBus: XQueryEventBus, public translator: Translator) { }

  public checkedOutByMeClicked() {
     this.xQueryEventBus.changexQuery(Constants.SEARCH_QUERY_CHECKOUT_BY_ME);
  }
  public createdByMeClicked() {
     this.xQueryEventBus.changexQuery(Constants.SEARCH_QUERY_CREATED_BY_ME);
  }
}
