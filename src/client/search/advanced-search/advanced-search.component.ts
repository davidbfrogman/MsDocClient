import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SohoTextAreaComponent } from '@infor/sohoxi-angular';
import { XQueryEventBus } from 'event-buses';
import { Constants, TranslationConstants } from '../../../constants';
import { Translator } from 'services';

@Component({
  selector: 'idm-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  providers: []
})
export class AdvancedSearchComponent implements OnInit {
  public xQuery: string;
  @ViewChild(SohoTextAreaComponent) textarea: SohoTextAreaComponent;

  constructor(private xQueryEventBus: XQueryEventBus, public translator: Translator) {  }

  ngOnInit() {
    this.subscribeToxQueryChangedEvent();
  }

  protected subscribeToxQueryChangedEvent() {
    this.xQueryEventBus.xQueryChanged$.subscribe((xQuery) => {
      this.xQuery = xQuery;
    });
  }

  public onClickSearch(): void {
    this.xQueryEventBus.changexQuery(this.xQuery);
  }
}

