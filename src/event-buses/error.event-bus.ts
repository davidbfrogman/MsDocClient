import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppError } from '../models';

@Injectable()
export class ErrorEventBus {
  private errorTriggerSource = new Subject<AppError>();
  public errorTrigger$ = this.errorTriggerSource.asObservable();

  throw(error: AppError) {
    this.errorTriggerSource.next(error);
  }
}
