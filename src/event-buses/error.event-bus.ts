import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppError } from '../models';

@Injectable()
export class ErrorEventBus {
  private error: Error;
  private errorTriggerSource = new Subject<AppError>();
  public errorTrigger$ = this.errorTriggerSource.asObservable();
  public created: number;
  public modalEventAdded: EventEmitter<AppError>;

  constructor () {
    this.created = Date.now();
    this.modalEventAdded = new EventEmitter();
  }

  throw(error: AppError) {
    this.error = error;
    this.errorTriggerSource.next(error);
  }

  throwModal(error: AppError) {
    this.modalEventAdded.emit(error);
  }
}
