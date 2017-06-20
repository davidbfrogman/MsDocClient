import {
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Attribute, Item } from 'models';
import { ActionUtility, AttributeUtility, ItemUtility } from 'utility';
import { ActionEventBus } from 'event-buses';
import { ActionsType } from 'enumerations';
import { Constants } from '../../../constants';

@Component({
  selector: 'idm-document-attributes',
  templateUrl: './document-attributes.component.html',
  styleUrls: ['./document-attributes.component.scss'],
  providers: [
    AttributeUtility
  ]
})
export class DocumentAttributesComponent implements OnChanges {

  @Input() item: Item;
  attributes: Attribute[];
  @Input() isItemEditable: boolean;

  constructor(private actionEventBus: ActionEventBus) { }

  ngOnChanges() {
    this.attributes = new Array<Attribute>();
    this.item.attrs.attr.forEach(attribute => {
      this.attributes.push(AttributeUtility.mapAttributeTypeEnumeration(attribute));
    });
  }

  onChange(value: string) {
    this.actionEventBus.triggerItemDirtyChangeAction(
      ActionUtility.createNewAction(ActionsType.Save, [this.item]));
  }

  attributeVisible(attribute: Attribute): boolean {
    switch (attribute.name) {
      case Constants.TEMPLATE_ATTRIBUTE_ID:
      case Constants.TEMPLATE_ATTRIBUTE_NAME:
      case Constants.TEMPLATE_ATTRIBUTE_DESCRIPTION:
        return false;
    }
    return true;
  }
}
