import { ItemResourceType } from "enumerations";
import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'models';
import { ItemService } from 'services';
import { ItemUtility } from "utility";

@Component({
  selector: 'idm-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {
  public name = 'file-name';
  public label = 'New file';
  public filename: string = '';
  public size: string = '';
  public mimetype: string = '';
  
  @Input() item: Item;

  constructor(public itemService: ItemService) { }

   ngOnInit() {
    this.loadFileProperties();
  }

  public onFileUploadChange(event: any): void {
     let fileList: FileList = event.target.files;
     if(fileList.length > 0) {
        this.setUploadedFile(this.item, fileList[0]);
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
    this.size = ItemUtility.getResourceProperty(this.item, ItemResourceType.Main, 'size');
    this.mimetype = ItemUtility.getResourceProperty(this.item, ItemResourceType.Main, 'mimetype');
  }
}

