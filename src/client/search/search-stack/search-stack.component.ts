import { Component, Input, Output, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Constants } from '../../../constants';
import { SearchStyleType, AttributeType, OperationType } from 'enumerations';
import { SearchStackEventBus } from 'event-buses';
import { Attribute, Entity, SearchStack, User, Value } from 'models';
import { XQueryBuilder } from 'utility';
import { SearchOperationFactory } from '../search-operation-factory';
import { Translator } from 'services';

@Component({
  selector: 'idm-search-stack',
  templateUrl: './search-stack.component.html',
  styleUrls: ['./search-stack.component.scss']
})

export class SearchStackComponent {

  // The search stack event bus is where we get our current list of search stacks that we can bind to.
  constructor(private searchStackEventBus: SearchStackEventBus,  public translator: Translator) {
  }

  public onDeleteStack(searchStack: SearchStack) {
    // This will send out a search stack onto the service bus for anyone who is subscribed
    // to the delete observable
    this.searchStackEventBus.deleteSearchStack(searchStack);
  }

  public onEditStack(searchStack: SearchStack) {
    // This will send out a search stack to anyone who is subscribed to the
    // edit stack search observable
    this.searchStackEventBus.editSearchStack(searchStack);
  }
}
