import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ActionsType } from 'enumerations';
import { Action } from 'models';

@Injectable()
export class ActionEventBus {

    // Observable Search xQuery Sources
    private actionSource = new Subject<Action>();

    // Observable Search xQuery Streams
    public actionChanged$ = this.actionSource.asObservable();

    triggerAction(selected: Action) {
        this.actionSource.next(selected);
        console.log( 'Selected action: ' + ActionsType[selected.action]); // TODO: use the right logging
    }
}
