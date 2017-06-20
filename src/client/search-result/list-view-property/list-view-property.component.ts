import { Component, Input, OnChanges } from '@angular/core';
import { Item } from 'models';
import { ItemUtility, AttributeUtility } from 'utility';

@Component({
  selector: 'idm-list-view-property',
  templateUrl: './list-view-property.component.html',
  styleUrls: ['./list-view-property.component.scss']
})
export class ListViewPropertyComponent implements OnChanges {
  public name: string = '';
  public value: string = '';
  public hasValue: boolean = false;
  @Input() item: Item;
  @Input() property: string;

  ngOnChanges() {
    this.computePropertyValue(this.item, this.property);
  }

  public computePropertyValue(item: Item, property: string): void {
    const attribute = ItemUtility.getResultListAttribute(item, property);
    if(attribute) {
      const value: string = AttributeUtility.getViewValue(attribute);
      if (value !== undefined) {
        this.name = attribute.name;
        this.value = value;
        this.hasValue = true;
      } else {
        this.hasValue = false;
      }
    }
  }
}
