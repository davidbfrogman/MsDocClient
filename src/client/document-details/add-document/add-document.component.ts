import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { EnvironmentType } from 'enumerations';
import { ErrorEventBus, DocumentsEventBus, ConfigurationEventBus } from 'event-buses';
import { Attribute, Entity, Item, Acl, AttributeCollection } from 'models';
import { EntityService, ItemService } from 'services';
import { AttributeUtility, EntityUtility, ItemUtility } from 'utility';
import { Constants } from '../../../constants';

@Component({
  selector: 'idm-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss'],
})
export class AddDocumentComponent implements OnInit {
  public entityList: Entity[];
  public templateList: Item[];
  public selectedTemplate: Item;
  public isDocumentSelected: boolean;
  public isSaveEnabled: boolean;

  constructor(
    public entityService: EntityService,
    public itemService: ItemService,
    public errorEventBus: ErrorEventBus,
    private documentsEventBus: DocumentsEventBus,
    private configuration: ConfigurationEventBus
  ) { }

  public ngOnInit() {
    this.isDocumentSelected = false;
    this.isSaveEnabled = false;
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

  public onEntitySelected(entity: Entity) {
    if (entity) {
      this.templateList = new Array<Item>();
      this.buildBlankTemplate(entity);
      this.isDocumentSelected = true;
      this.isSaveEnabled = true;
      // TODO: We also need to clear the currently selected template
      if (EntityUtility.IsEntityTemplateEnabled(entity) === true) {
        this.entityService.getTemplates(entity).subscribe((items) => {
          if (items && items.length > 0) {
            this.templateList = this.templateList.concat(items);
          }
        },
        error => {
          this.errorEventBus.throw(error);
        });
      }
    }
  }

  private buildBlankTemplate(entity: Entity): void {
    const blankTemplate = new Item();
    blankTemplate.acl = new Acl();
    blankTemplate.acl.name = entity.defaultAcl;
    blankTemplate.entityName = entity.name;
    blankTemplate.templateName = 'Blank';
    blankTemplate.displayName = '[New Document]';
    blankTemplate.templateDescription = 'Create a blank document of the selected document type.';
    blankTemplate.templateThumbnail = 'assets/images/defaultBlankDocumentThumbnail.png';
    blankTemplate.checkedOutBy = this.configuration.getConfiguration(Constants.PROP_CONNECTION_USERNAME);
    blankTemplate.attrs = new AttributeCollection();
    blankTemplate.attrs.attr = entity.attrs.attr.map(attribute => {
      return <Attribute>{
        name: attribute.name,
        qual: attribute.qual,
        type: attribute.type
      };
    });

    this.templateList.push(blankTemplate);
    this.selectedTemplate = blankTemplate;
  }

  public onItemSelected(item: Item) {
    this.isSaveEnabled = true;
    this.selectedTemplate = item;
  }

  public onItemOpened(event: any, item: Item) {
    event.preventDefault();
    event.stopPropagation();
    this.documentsEventBus.closeDocumentModal(item);
  }
}
