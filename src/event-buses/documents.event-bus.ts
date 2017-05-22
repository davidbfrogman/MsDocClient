import { Injectable, EventEmitter } from '@angular/core';
import { Item } from 'models';

@Injectable()
export class DocumentsEventBus {
  public onCreateDocumentModal: EventEmitter<Item>;

  constructor() {
    this.onCreateDocumentModal = new EventEmitter();
  }

  closeDocumentModal(document: Item) {
    this.onCreateDocumentModal.emit(document);
  }
}
