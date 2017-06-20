import { Injectable } from '@angular/core';
import { AppInfoModal, AppInfoAction } from 'models';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InfoEventBus {
  private modalEventSource = new Subject<AppInfoModal>();
  public modalEventOpen$ = this.modalEventSource.asObservable();

  constructor () { }

  throwModal(info: AppInfoModal) {
    this.modalEventSource.next(info);
  }
}
