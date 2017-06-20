import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ActionsType } from 'enumerations';
import { Action } from 'models';
import { ItemUtility } from 'utility';

@Injectable()
export class ActionEventBus {

    // Actions change events
    private actionSource = new Subject<Action>();
    public actionChanged$ = this.actionSource.asObservable();

    // Document change events
    private itemDirtyChangedSource = new Subject<Action>();
    public itemDirtyChanged$ = this.itemDirtyChangedSource.asObservable();

    triggerAction(selected: Action) {
        this.actionSource.next(selected);
    }

    triggerItemDirtyChangeAction(action: Action) {
        this.itemDirtyChangedSource.next(action);
    }
}
