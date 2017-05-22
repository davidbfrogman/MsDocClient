import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorEventBus } from 'event-buses';
import { AppError } from 'models';

@Injectable()
export class AppErrorHandler extends ErrorHandler {
   constructor(private errorEventBus: ErrorEventBus) { 
     super();
   }

   handleError(error: Error) {
     console.log('AppErrorHandler', error);
     const appError: AppError = new AppError();
     appError.message = error.message;
     this.errorEventBus.throw(appError);
   }
}