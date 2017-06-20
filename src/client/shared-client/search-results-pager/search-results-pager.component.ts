import { Component, Input, OnChanges } from '@angular/core';
import { Item } from 'models';
import { SearchStackEventBus, ConfigurationEventBus } from 'event-buses';
import { Constants } from './../../../constants';
import { Translator } from 'services';

@Component({
  selector: 'idm-search-results-pager',
  templateUrl: './search-results-pager.component.html',
  styleUrls: ['./search-results-pager.component.scss']
})
export class SearchResultsPagerComponent implements OnChanges {
  @Input() items: Item[];
  @Input() totalSearchCount: number;

  private _pagesCount: number;
  private _page: number;
  limit: number;
  offset: number = 0;
  active: boolean = false; // Show pager if there're more than one page of items

  nextDisabled: boolean = true;
  prevDisabled: boolean = true;

  constructor(
    private searchStackEventBus: SearchStackEventBus,
    private configurationEventBus: ConfigurationEventBus,
    public translator: Translator
  ) {
    this.offset = 0;
    this.limit = this.configurationEventBus.getConfigurationAsNumber(Constants.SEARCH_RESULT_PAGE_SIZE, Constants.SEARCH_PAGE_SIZE);
  }

  ngOnChanges(): void {
    this.active = this.totalSearchCount > this.limit;
    this.nextDisabled = this.page === this.pagesCount;
    this.prevDisabled = this.page === 1;
  }

  public get pagesCount(): number {
    return Math.ceil(this.totalSearchCount / this.limit);
  }

  public get page(): number {
    return Math.ceil((this.offset + 1) / this.limit);
  }

  public set page(page: number) {
    if (!page || page <= 0) {
      return;
    }

    if (page > this.pagesCount) {
      this.offset = (this.pagesCount - 1) * this.limit;
    } else {
      this.offset = (page - 1) * this.limit;
    }

    this.searchStackEventBus.reloadSearch();
  }

  loadNextPage(): void {
    this.offset += this.limit;
    this.searchStackEventBus.reloadSearch();
  }

  loadPreviousPage(): void {
    this.offset -= this.limit;
    this.searchStackEventBus.reloadSearch();
  }

  loadLastPage(): void {
    this.offset = (this.pagesCount - 1) * this.limit;
    this.searchStackEventBus.reloadSearch();
  }

  loadFirstPage(): void {
    this.offset = 0;
    this.searchStackEventBus.reloadSearch();
  }
}
