import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Constants } from '../constants';
import { SearchStyleType, AttributeType, OperationType } from 'enumerations';
import { Attribute, Entity, SearchStack, Value } from 'models';
import { AttributeUtility, EntityUtility } from 'utility';

@Injectable()
export class XQueryEventBus {
    public xQuery: string;

    // Observable Search xQuery Sources
    private xQueryChangedSource = new Subject<string>();
    
    // Observable Search xQuery Streams
    public xQueryChanged$ = this.xQueryChangedSource.asObservable();
    
    changexQuery(xQuery: string) {
        this.xQuery = xQuery;
        this.xQueryChangedSource.next(xQuery);
    }

    initxQuery() {
        this.changexQuery(Constants.SEARCH_INITIAL_XQUERY);
    }
}
