import { Component, ViewChild, Input, Output, OnInit } from '@angular/core';
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
  public isToggleAdvancedLine: boolean = true;
  public isToggleAdvancedText: boolean = false;
  public advancedExpanderButtonName: any = 'caret-down';

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

  public onToggleAdvancedButton(): void {
    this.isToggleAdvancedLine = !this.isToggleAdvancedLine;
    if (this.isToggleAdvancedText === false) {
      this.advancedExpanderButtonName = 'caret-up';
    } else { this.advancedExpanderButtonName = 'caret-down';
  }
    this.isToggleAdvancedText = !this.isToggleAdvancedText;
  }
}
