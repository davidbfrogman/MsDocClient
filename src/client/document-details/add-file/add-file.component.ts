import { ItemResourceType } from 'enumerations';
import { Component, Input, OnChanges, ElementRef, AfterViewChecked } from '@angular/core';
import { Item } from 'models';
import { ItemService } from 'services';
import { ActionUtility, ItemUtility } from 'utility';
import { ActionEventBus } from 'event-buses';
import { ActionsType } from 'enumerations';
import { Translator } from 'services';

@Component({
  selector: 'idm-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnChanges, AfterViewChecked {
  @Input() isItemEditable;
  public name = 'file-name';
  public filename = '';
  public size = '';
  public mimetype = '';

  @Input() item: Item;

  constructor(
    public actionEventBus: ActionEventBus,
    public itemService: ItemService,
    public translator: Translator,
    private elementRef: ElementRef
  ) { }

  ngOnChanges() {
    this.loadFileProperties();
  }

  ngAfterViewChecked() {
    this.setFileName();
  }

  private setFileName(): void {
    const el = this.elementRef.nativeElement.querySelector('#file-name-filename');
    if (el) {
      el.value = this.filename;
    }
  }

  public onFileUploadChange(event: any): void {
     const fileList: FileList = event.target.files;
     if (fileList.length > 0) {
        this.setUploadedFile(this.item, fileList[0]);
        this.actionEventBus.triggerItemDirtyChangeAction(
          ActionUtility.createNewAction(ActionsType.Save, [this.item]));
     }
  }

  public setUploadedFile(item: Item, file: File): void {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = element => {
        const base64 = reader.result.split(',')[1];
        this.addResource(file, base64);
        this.loadFileProperties();
      };
  }

  addResource(file: File, base64: string) {
    const filename: string = file.name;
    const size: string = file.size.toString();
    const mimetype: string = file.type;

    ItemUtility.addResource(this.item, ItemResourceType.Main, filename, mimetype, base64, size);
    ItemUtility.addResource(this.item, ItemResourceType.Preview, filename, 'image/png', '', '');
    ItemUtility.addResource(this.item, ItemResourceType.SmallPreview, filename, 'image/png', '', '');
    ItemUtility.addResource(this.item, ItemResourceType.Thumbnail, filename, 'image/png', '', '');
  }

  loadFileProperties() {
    this.filename = ItemUtility.getResourceProperty(this.item, ItemResourceType.Main, 'filename');
    this.size = ItemUtility.formatBytes( Number(ItemUtility.getResourceProperty(this.item, ItemResourceType.Main, 'size')));
    this.mimetype = ItemUtility.getResourceProperty(this.item, ItemResourceType.Main, 'mimetype');
  }
}

