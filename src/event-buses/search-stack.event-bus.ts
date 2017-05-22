import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SearchStyleType, AttributeType, OperationType } from 'enumerations';
import { Attribute, Entity, SearchStack, Value } from 'models';
import { AttributeUtility, EntityUtility } from 'utility';

@Injectable()
export class SearchStackEventBus {
    // We have the array here, because it's needed by multiple components.
    // For the most part though, this array is managed by search stack component.
    public searchStacks: Array<SearchStack>;
    public currentSearchStackID: number = 0;

    // Observable Search Stack Sources
    private searchStackAddedSource = new Subject<SearchStack>();
    private searchStackEditedSource = new Subject<SearchStack>();
    private searchStackSavedSource = new Subject<SearchStack>();
    private searchStackDeletedSource = new Subject<SearchStack>();

    // Observable Search Stack Streams
    public searchStackAdded$ = this.searchStackAddedSource.asObservable();
    public searchStackEdited$ = this.searchStackEditedSource.asObservable();
    public searchStackSaved$ = this.searchStackSavedSource.asObservable();
    public searchStackDeleted$ = this.searchStackDeletedSource.asObservable();

    addSearchStack(searchStack: SearchStack) {
        if (!this.searchStacks) {
            this.searchStacks = new Array<SearchStack>();
        }
        searchStack.id = this.currentSearchStackID;
        this.currentSearchStackID++;
        this.searchStacks.push(searchStack);
        this.searchStackAddedSource.next(searchStack);
    }

    editSearchStack(searchStack: SearchStack) {
        this.searchStackEditedSource.next(searchStack);
    }

    saveSearchStack(searchStack: SearchStack) {
        let indexToReplace = this.searchStacks.findIndex((searchStackFind) => {
            return searchStackFind.id == searchStack.id;
        });
        this.searchStacks[indexToReplace] = searchStack;
        this.searchStackSavedSource.next(searchStack);
    }

    deleteSearchStack(searchStack: SearchStack) {
        const indexOfItemToRemove = this.searchStacks.indexOf(searchStack);
        if (indexOfItemToRemove > -1) {
            this.searchStacks.splice(indexOfItemToRemove, 1);
        }
        this.searchStackDeletedSource.next(searchStack);
    }
}