import { Component, OnInit, Output } from '@angular/core';
import { SohoToolbarComponent } from '@infor/sohoxi-angular';
import { ViewSelectorEventBus} from 'event-buses';
import { SearchResultListViewsType } from 'enumerations';
import { Translator } from 'services';

@Component({
  selector: 'idm-list-view-selector',
  templateUrl: './list-view-selector.component.html',
  styleUrls: ['./list-view-selector.component.scss']
})
export class ListViewSelectorComponent implements OnInit {

  constructor(private viewSelectorEventBus: ViewSelectorEventBus, public translator: Translator) { }
  ngOnInit() {
    this.onCardListSelected();
   }

  public onCardListSelected(): void {
    this.viewSelectorEventBus.selectSearchResultView(SearchResultListViewsType.Card);
  }

  public onDetailListSelected(): void {
    this.viewSelectorEventBus.selectSearchResultView(SearchResultListViewsType.Detail);
  }

  public onThumbnailListSelected(): void {
    this.viewSelectorEventBus.selectSearchResultView(SearchResultListViewsType.Thumbnail);
  }
}
