import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SohoDatePickerComponent, SohoTimePickerComponent } from '@infor/sohoxi-angular';
import { EnvironmentType, AttributeType } from 'enumerations';
import { environment } from '../../environments/environment';
import { ConfigurationEventBus, CacheEventBus, ErrorEventBus, InfoEventBus }  from 'event-buses';
import { Attribute, AppError, AppInfoModal, AppInfoAction, Entity, Item, Property, User } from 'models';
import { CacheEvent, ItemService, UserService } from 'services';
import { AttributeUtility, ItemUtility } from 'utility';

@Component({
  selector: 'idm-service-utility',
  templateUrl: './service-utility.component.html',
  providers: []
})
export class ServiceUtilityComponent {
  @ViewChild(SohoDatePickerComponent) datepicker: SohoDatePickerComponent;
  @ViewChild(SohoTimePickerComponent) timepicker: SohoTimePickerComponent;

  public isDevelopment: boolean = environment.environmentType == EnvironmentType.Dev;
  public templateName: string;
  public templateDescription: string;

  public attributeString: Attribute;
  public attributeNumber: Attribute;
  public attributeBoolean: Attribute;
  public attributeDatePicker: Attribute;
  public attributeTimePicker: Attribute;
  public attributeDateTimePicker: Attribute;
  public attributeValueset: Attribute;
  public timeValue: string = "20:11";

  @Input() fileName: string = '';
  public text = 'Upload a File';
  public name1 = 'file-name';
  protected file: File;
  protected fileBase64: string;
  public status: string;

  public xQuery: string;
  public itemsList: Item[];
  public selectedItem: Item;
  public selectedThumbnail: string;
  public selectedEntity: Entity;
  public entityList : Entity[];
  
  public users: User[];
  public items: Item[];
  public cacheEvent: CacheEvent;

  public ionEntitiesFilterTimestamp: string;

  public constructor(private itemService: ItemService, private configurationEventBus:  ConfigurationEventBus, protected cacheEventBus: CacheEventBus, private errorEventBus: ErrorEventBus, private infoEventBus: InfoEventBus, private userService: UserService){
    this.attributeString = AttributeUtility.buildDefaultAttribute('nameString', 'descString', 'qualString', true, AttributeType.String, false, 'valueString');
    this.attributeNumber = AttributeUtility.buildDefaultAttribute('nameNumber', 'descNumber', 'qualNumber', true, AttributeType.Short, false, '123');
    this.attributeNumber.size = '2';
    this.attributeBoolean = AttributeUtility.buildDefaultAttribute('nameBoolean', 'descBoolean', 'qualBoolean', true, AttributeType.Boolean, false, 'true');
    this.attributeDatePicker = AttributeUtility.buildDefaultAttribute('nameDatePicker', 'descDatePicke', 'qualDatePicke', true, AttributeType.Date, false, '2016-12-01');
    this.attributeTimePicker = AttributeUtility.buildDefaultAttribute('nameTimePicker', 'descTimePicker', 'qualTimePicker', true, AttributeType.Time, false, '12:13:14Z');
    this.attributeDateTimePicker = AttributeUtility.buildDefaultAttribute('nameTimestampPicker', 'descTimestampPicker', 'qualTimestampPicker', true, AttributeType.Timestamp, false, '2017-12-03T20:17:10Z');
    this.attributeValueset = AttributeUtility.buildDefaultAttribute('nameValueset', 'descValueset', 'qualValueset', true, AttributeType.String, true, 'value1Valueset');
    this.attributeValueset.valueset = {
      value: [{name: 'value1Valueset',  'desc':'desc1Valueset'}, {name: 'value2Valueset',  desc:'desc2Valueset'}]
    }
    this.subscribeToCacheEvent();
  }

  protected subscribeToCacheEvent() {
    this.cacheEventBus.cacheEvent$.subscribe((cacheEvent) => {
      this.cacheEvent = cacheEvent;
    });
  }

  public onChange(event: any) {
    console.log('here', event.target);
  }

  public onFileUploadChange(event: any): void {
     let fileList: FileList = event.target.files;
     if(fileList.length > 0) {
        this.file = fileList[0];
        const reader = new FileReader();
        let fileBase64: string = null;
        const _this = this;
        reader.onload = function (element) {
            _this.fileBase64 = reader.result.split(',')[1];
        };
        reader.readAsDataURL(this.file);
     }
  }

  public onClickUpload(): void {
    let myItem : Item = new Item();
    myItem.entityName = 'Daves_MV_Attribute_Doc';
 
    if(this.templateDescription && this.templateName){
      ItemUtility.addAttribute(myItem,'MDS_TemplateName', this.templateName,AttributeType.String);
      ItemUtility.addAttribute(myItem,'MDS_TemplateDetails', this.templateDescription,AttributeType.String);
    }
    
    this.itemService.create(myItem, { '$checkout': false }).subscribe((item: Item) => {
      this.status = `Just created a document with pid: ${item.pid}`;
    }, error => {
      this.errorEventBus.throw(error); 
    });
  }

  public onClickGetUsersCached(): void {
    this.userService
      .search('a', 20)
      .subscribe(users => {
        this.users = users;
      }, error => {
        this.errorEventBus.throw(error);
      });
  }

  public onClickGetUsersNotCached(): void {
    this.userService
      .search('a', 20, {cache: false})
      .subscribe(users => {
          this.users = users;
        }, error => {
          this.errorEventBus.throw(error);
        });
  }

  public onClickClearUsersCache(): void {
    this.userService.clearCache();
    this.users = null;
  }

  public onClickGetItemsCached(): void {
    this.itemService.search('/MDS_File', 0, 2, {cache: true}).subscribe((items: Item[]) => { // TODO: How do we get limit from grid and pagination stuff
      this.items = items['item'];
    }, error => {
       this.errorEventBus.throw(error);
    });
  }

  public onClickGetItemsNotCached(): void {
    this.itemService.search('/MDS_File', 0, 2, {cache: false}).subscribe((items: Item[]) => { // TODO: How do we get limit from grid and pagination stuff
      this.items = items['item'];
    }, error => {
       this.errorEventBus.throw(error);
    });
  }

  public onClickGetProperties(): void {
    this.ionEntitiesFilterTimestamp = this.configurationEventBus.getConfiguration('IonEntitiesFilterTimestamp');
  }

  public onClickClearItemsCache(): void {
    this.itemService.clearCache();
    this.items = null;
  }

  public onClickPerformanceTest(): void {
    console.time('search');
    for(let i = 0; i < 1000; i++) {
      console.time('search' + i);
      this.itemService.setCache('url'+i, null, {object: null})
      console.timeEnd('search' + i);
      console.time('clear' + i);
      this.itemService.clearCache();
      console.timeEnd('clear' + i);
    }
    console.timeEnd('search');
  }

  openInfoModal() {
    let info = new AppInfoModal();
    let alertAction = new AppInfoAction();

    info.title = 'Modal title';
    info.message = 'Sone engaging info message';
    alertAction.text = "Click me";
    alertAction.run = () => alert('You clicked me');
    info.actions = [alertAction];
    
    this.infoEventBus.throwModal(info);
  }

  openErrorModal() {
    try {
      throw new Error('Some descriptive error message');
    } catch(e) {
      e.name = 'Error title'
      this.errorEventBus.throwModal(<AppError>e);
    }
  }
}
