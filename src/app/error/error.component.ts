import { Component } from '@angular/core';
import { ErrorEventBus } from '../../event-buses';
import { AppError } from '../../models';

@Component({
  selector: 'idm-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  public title: string;
  public errorTriggered: boolean = false;
  public showDetails: boolean = false;
  public errorMessage: string;
  public errorDescription: string;
  public errorName: string;
  private currentError: AppError;
  public isClosedFromUser: boolean = false;

  constructor(private errorEventBus: ErrorEventBus) {
    this.subscribeToErrorEvent();
  }

  public changeShowDetails(): void {
    this.showDetails = !this.showDetails;
  }

  public closeError() {
    this.isClosedFromUser = true;
  }

  protected subscribeToErrorEvent() {
    this.errorEventBus.errorTrigger$.subscribe((error) => {
      this.title = 'Aplication error';
      this.currentError = error;
      this.errorName = error.name;
      this.errorMessage = error.message;
      this.errorDescription = error.description;
      this.errorTriggered = true;
      this.isClosedFromUser = false;
      console.error('ErrorComponent', error);
    });
  }
}
