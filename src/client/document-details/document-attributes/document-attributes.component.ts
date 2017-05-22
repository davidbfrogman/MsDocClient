import {
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Attribute, Item } from 'models';
import { AttributeUtility, ItemUtility } from 'utility';
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
  isItemEditable: boolean;

  constructor() { }

  ngOnChanges() {
    this.attributes = new Array<Attribute>();
    this.isItemEditable = ItemUtility.editable(this.item);
    this.item.attrs.attr.forEach(attribute => {
      this.attributes.push(AttributeUtility.mapAttributeTypeEnumeration(attribute));
    });
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
