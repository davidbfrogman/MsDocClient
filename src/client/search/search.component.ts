import { Component, Input, Output } from '@angular/core';
import { AttributeSearchComponent } from './attribute-search/attribute-search.component';
import { SearchStackEventBus, XQueryEventBus } from '../../event-buses/';

@Component({
  selector: 'idm-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchStackEventBus]
})
export class SearchComponent {
  public xQuery: string;

  constructor(private xQueryEventBus: XQueryEventBus, private searchStackEventBus: SearchStackEventBus) {
   this.subscribeToxQueryChangedEvent();
  }

  protected subscribeToxQueryChangedEvent() {
    this.xQueryEventBus.xQueryChanged$.subscribe((xQuery) => {
      this.xQuery = xQuery;
    });
  }
}
