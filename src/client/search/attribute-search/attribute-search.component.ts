import { Component, Input, Output, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { SearchStyleType, AttributeType, OperationType } from 'enumerations';
import { SearchOperationFactory } from '../search-operation-factory';
import * as moment from 'moment';
import { SohoDatePickerComponent, SohoDropDownComponent, SohoTimePickerComponent } from '@infor/sohoxi-angular';
import { Constants } from '../../../constants';
import { ErrorEventBus, SearchStackEventBus, XQueryEventBus } from 'event-buses';
import { Attribute, Entity, Operation, SearchStack, User, Value } from 'models';
import { EntityService, UserService } from 'services';
import { AttributeUtility, EntityUtility, XQueryBuilder } from 'utility';
import { Translator } from 'services';

@Component({
  selector: 'idm-attribute-search',
  templateUrl: './attribute-search.component.html',
  styleUrls: ['./attribute-search.component.scss'],
  providers: []
})
export class AttributeSearchComponent implements OnInit {
  public xQuery: string;

  public freeTextSearch: string;
  public entityList: Entity[];
  public attributeList: Attribute[];
  public operatorList: Operation[];
  public usersList: User[];
  public currentSearchStack: SearchStack;

  public selectedEntity: Entity;
  public selectedAttribute: Attribute;
  public previouslySelectedAttribute: Attribute;
  public selectedAttributeEmpty: Attribute = this.buildDefaultAttribute();
  public selectedOperation: Operation;
  public searchUserFormControl = new FormControl();
  public userSearchDebounceTiming = 400; // A value in milliseconds to wait before executing a user search from a user typing.

  // We basically stop the searching whenever someone selects a user for one 'cycle'.
  // We just turn it off, to skip the searching, and then turn it back on.
  public isUserSearchingActive = true;

  public showAttributeField: boolean = false;
  public searchAttributeDisabled: boolean = false;
  public attributeFieldPlaceholder: string = 'Search';
  public isEditingSearchStack: boolean;

  constructor(
    public entityService: EntityService,
    public userService: UserService,
    public searchStackEventBus: SearchStackEventBus,
    public xQueryEventBus: XQueryEventBus,
    public errorEventBus: ErrorEventBus,
    public translator: Translator
  ) {
    this.subscribeToxQueryChangedEvent();
    this.subscribeToEditStackEvent();
    this.subscribeToDeleteStackEvent();

    this.isUserSearchingActive = false;  // Otherwise the search box will be open with results when we show the user search box.
    this.initializeTypeAheadUserSearching();
  }

  public ngOnInit() {
    this.populateEntitiesList();
  }

  public populateEntitiesList() {
    // When this control starts, go get the entities.
    this.entityService.getList<Entity>().subscribe(entities => {
      this.entityList = entities;
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  protected subscribeToxQueryChangedEvent() {
    this.xQueryEventBus.xQueryChanged$.subscribe((xQuery) => {
      this.xQuery = xQuery;
    });
  }

  public initializeTypeAheadUserSearching() {
    this.searchUserFormControl.valueChanges
      .debounceTime(this.userSearchDebounceTiming)
      .distinctUntilChanged()
      .subscribe((userSearchString) => {
        this.searchForUsers(userSearchString);
      });
  }

  public searchForUsers(userSearchString: string) {
    // If it's not currently active, that's because someone just selected a user from the list.
    // So we skip re searching for just this one cycle.
    if (this.isUserSearchingActive) {
      this.userService.search(userSearchString, 20).subscribe(users => {
        if (users) {
          this.usersList = users;
        }
      }, error => {
        this.errorEventBus.throw(error);
      });
    } else {
      // We turn searching back on, so the user can delete the text in the box, and searching will work again.
      this.isUserSearchingActive = true;
    }
  }

  public subscribeToEditStackEvent() {
    this.searchStackEventBus.searchStackEdited$.subscribe((searchStack) => {
      this.selectedEntity = searchStack.entity;
      this.onSelectedEntityChanged(searchStack.entity);

      this.selectedAttribute = searchStack.attribute;
      this.onSelectedAttributeChanged(searchStack.attribute);

      if (searchStack.operation) {
        this.selectedOperation = this.operatorList.find((operator) => {
          return operator.operationType === searchStack.operation.operationType;
        });
      }
      this.freeTextSearch = searchStack.freeTextSearchOperand;
      this.setOperand(searchStack.operand);

      this.isEditingSearchStack = true;
      this.currentSearchStack = searchStack;
    });
  }

  public subscribeToDeleteStackEvent() {
    this.searchStackEventBus.searchStackDeleted$.subscribe((searchStack) => {
      this.resetAllControls();
      this.currentSearchStack = searchStack;
    });
  }

  public onClickSearch() {
    this.xQuery = new XQueryBuilder().withConfig({
      entity: this.selectedEntity,
      attribute: this.selectedAttribute,
      operation: this.selectedOperation,
      operand: this.getOperand(), // this will get the value out of dropdown/textbox/datepicker for us
      freeTextSearchOperand: this.freeTextSearch,
      searchStacks: this.searchStackEventBus.searchStacks,
      entityList: this.entityList
    }).build();
    this.xQueryEventBus.changexQuery(this.xQuery);
  }

  public onClickSaveStack() {
    const stackToSave = this.getSearchStackFromUI();
    stackToSave.id = this.currentSearchStack.id;

    this.searchStackEventBus.saveSearchStack(stackToSave);
    this.isEditingSearchStack = false;
    this.resetAllControls();
  }

  public onClickAddStack() {
    if (this.getSearchStackFromUI().entity) {
      this.searchStackEventBus.addSearchStack(this.getSearchStackFromUI());
      this.resetAllControls();
    }
  }

  public getSearchStackFromUI(): SearchStack {
    return new SearchStack(
      this.selectedEntity,
      this.selectedAttribute,
      this.selectedOperation,
      this.getOperand(),
      '',
      '',
    );
  }

  public onClickReset() {
    this.resetAllControls();
    this.searchStackEventBus.clearSearchStack();
    this.xQueryEventBus.changexQuery('');
  }

  public onClickCancel() {
    this.resetAllControls();
  }

  public onSelectedEntityChanged(entity?: Entity) {
    this.resetAttributeControlls();
    if (entity && entity.attrs) {
      const isComprehensiveAttrBuilt = entity.isComprehensiveAttrBuilt;
      // Here we need to load the attr list from the entity, and populate the attribute drop down list
      this.attributeList = EntityUtility.BuildComprehensiveAttributes(entity).comprehensiveAttributes;
    }
  }

  public onSelectedAttributeChanged(attribute: Attribute) {
    if (attribute) {
      this.selectDefaultAttributeValue();
      this.operatorList = null;
      this.operatorList = new SearchOperationFactory().getOperations(attribute);
      this.selectedOperation = this.operatorList[0];
      if (attribute.isUserForSearching) {
        this.isUserSearchingActive = false;
      }
      this.previouslySelectedAttribute = this.selectedAttribute;
    }
  }

  public onUserSelected(user: User) {
    this.selectedAttribute.value = user.name;
    this.usersList = undefined;
    this.isUserSearchingActive = false;
  }

  public onOperandChange(operand: Operation) {
    switch (operand.operationType) {
      case OperationType.HasValue:
      case OperationType.NoValue:
        this.searchAttributeDisabled = true;
        break;
      default:
        this.searchAttributeDisabled = false;
    }
  }

  public resetAllControls() {
    this.freeTextSearch = undefined;
    this.selectedEntity = undefined;
    this.onSelectedEntityChanged();
    this.isEditingSearchStack = false;
    this.currentSearchStack = undefined;
  }

  public resetAttributeControlls() {
    this.attributeList = undefined;
    this.operatorList = undefined;
    this.selectedOperation = undefined;
    this.selectedAttribute = undefined;
    this.selectedAttributeEmpty.value = undefined;
  }

  public getOperand(): string {
    return (this.selectedAttribute !== undefined) ? AttributeUtility.getFormValue(this.selectedAttribute) : null;
  }

  public setOperand(operand: string) {
    this.isUserSearchingActive = false;
    if (this.selectedAttribute) {
      this.selectedAttribute.value = AttributeUtility.getApiValue(this.selectedAttribute, operand);
    }
  }

  private buildDefaultAttribute() {
    return AttributeUtility.buildDefaultAttribute(
      this.translator.translate(
        this.translator.constants.SEARCH),
      '', 'search', false, AttributeType.String, false
    );
  }

  private selectDefaultAttributeValue() {
    const oldAttr = this.previouslySelectedAttribute;
    const newAttr = this.selectedAttribute;

    if (this.previouslySelectedAttribute && AttributeUtility.attributesTypeMatch(oldAttr, newAttr)) {
      this.selectedAttribute.value = AttributeUtility.computeDefaultValue(this.selectedAttribute, oldAttr.value);
    } else {
      this.selectedAttribute.value = AttributeUtility.computeDefaultValue(this.selectedAttribute);
    }
  }
}
