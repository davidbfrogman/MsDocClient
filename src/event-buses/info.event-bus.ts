import { Injectable, EventEmitter } from '@angular/core';
import { AppInfoModal, AppInfoAction } from 'models';

@Injectable()
export class InfoEventBus {
  public modalEventAdded: EventEmitter<AppInfoModal>;

  constructor () {
    this.modalEventAdded = new EventEmitter();
  }

  throwModal(info: AppInfoModal) {
    this.modalEventAdded.emit(info);
  }
}
