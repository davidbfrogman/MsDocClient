import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Item } from 'models';

@Injectable()
export class DocumentsEventBus {
  private createDocumentEventSource = new Subject<Item>();
  public documentEventCreate$ = this.createDocumentEventSource.asObservable();

  constructor() { }

  closeDocumentModal(document: Item) {
    this.createDocumentEventSource.next(document);
  }
}
