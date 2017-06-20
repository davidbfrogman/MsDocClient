import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  SohoBusyIndicatorDirective,
  SohoDropDownComponent
} from '@infor/sohoxi-angular';
import { Subject } from 'rxjs/Rx';
import { DropdownItem } from './dropdown-item.interface';

@Component({
  selector: 'idm-dropdown-async',
  templateUrl: './dropdown-async.component.html'
})
export class DropdownAsyncComponent implements AfterViewInit {
  @ViewChild(SohoDropDownComponent) dropdown: SohoDropDownComponent;
  @ViewChild(SohoBusyIndicatorDirective) busyIndicator: SohoBusyIndicatorDirective;
  @Input() model: DropdownItem;
  @Input() change: Function;
  @Input() context: any;

  private _id: string;
  private dropdownItemsData: DropdownItem[];
  private dropdownRendered: boolean;

  public dropdownItemsSource: Subject<DropdownItem[]> = new Subject<DropdownItem[]>();
  public name: string;

  constructor(private changeDetector: ChangeDetectorRef) {
    this.dropdownRendered = false;
  }

  @Input()
  set id(id: string) {
    this._id = id;
    this.name = 'acl-dropdown-' + id;
  }

  @Input()
  set data(data: DropdownItem[]) {
    if (data) {
      this.dropdownItemsData = data;
      if (this.dropdownRendered) {
        this.updateDropdown();
      }
    }
  }

  ngAfterViewInit() {
    this.busyIndicator.activated = true;
    if (this.dropdownItemsData) {
      this.updateDropdown();
    }
    this.dropdownRendered = true;
  }

  ngOnModelChange(): void {
    if (this.change && this.context) {
      this.change.call(this.context);
    }
  }

  private updateDropdown(): void {
    this.dropdownItemsSource.next(this.dropdownItemsData);
    this.changeDetector.detectChanges();
    this.dropdown.updated();
    this.busyIndicator.activated = false;
  }
}
