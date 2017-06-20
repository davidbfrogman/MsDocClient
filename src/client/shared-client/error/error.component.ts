import { Component } from '@angular/core';
import { AppError } from 'models';
import { Translator } from 'services';

@Component({
  selector: 'idm-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  public showDetails: boolean = false;
  public errorMessage: string;
  public errorDescription: string;

  public changeShowDetails(): void {
    this.showDetails = !this.showDetails;
  }

  public setError(error: AppError) {
    this.errorMessage = error.message;
    this.errorDescription = error.description;
  }

  constructor(public translator: Translator) {}
}
