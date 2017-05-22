import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SearchResultListViewsType } from 'enumerations';

@Injectable()
export class ViewSelectorEventBus {

    // Public version of the selected view, used to bind to in html
    public selectedSearchResultView: SearchResultListViewsType;

    private selectedSearchResultViewSource = new Subject<SearchResultListViewsType>();

    public selectedSearchResultViewChanged$ = this.selectedSearchResultViewSource.asObservable();

    selectSearchResultView(searchResultViewType: SearchResultListViewsType) {
        this.selectedSearchResultView = searchResultViewType;
        this.selectedSearchResultViewSource.next(this.selectedSearchResultView);
    }
}
