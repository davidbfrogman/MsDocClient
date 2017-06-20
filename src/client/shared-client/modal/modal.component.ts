import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { SohoMessageService, SohoMessageRef, SohoModalDialogService } from '@infor/sohoxi-angular';
import { InfoEventBus, ErrorEventBus } from 'event-buses';
import { AppInfoModal, AppInfoAction, AppError } from 'models';
import { ErrorComponent } from '../error/error.component';
import { Translator } from 'services';

class AppInfoActionClickable extends AppInfoAction {
 public click: (message, modal) => void;
}

@Component({
  selector: 'idm-soho-modal',
  template: `<div #errorPlaceholder></div>`
})
export class ModalComponent implements OnInit {
  @ViewChild('errorPlaceholder', { read: ViewContainerRef})
  errorPlaceholder: ViewContainerRef;

  dialog: SohoMessageRef;
  private defaultButton: AppInfoActionClickable;
  private buttons: AppInfoAction[];

  constructor(
    private messageService: SohoMessageService,
    private modalService: SohoModalDialogService,
    private translator: Translator,
    private infoEventBus: InfoEventBus,
    private errorEventBus: ErrorEventBus
  ) {
    this.defaultButton = new AppInfoActionClickable();
    this.defaultButton.text = 'Close';
  }

  ngOnInit() {
    this.infoEventBus.modalEventOpen$
      .subscribe(info => this.openInfo(info));
    this.errorEventBus.errorTrigger$
      .subscribe(error => this.openError(error));
  }

  private activateActionButtons(actions: AppInfoAction[]): void {
    this.buttons = new Array<AppInfoActionClickable>();
    if (actions) {
      actions.push(this.defaultButton);
    } else {
      actions = [this.defaultButton];
    }

    actions.forEach((action) => {
      const button = <AppInfoActionClickable>action;
      button.click = (message, modal) => {
        if (button.run) {
          button.run();
        };
        this.dialog = null;
        modal.close();
      };
      this.buttons.push(button);
    });
  }

  openInfo(info: AppInfoModal): void {
    this.activateActionButtons(info.actions);
    this.dialog = this.messageService
      .message()
      .title(`<span>${info.title}</span>`)
      .message(`<span class="longer-message">${info.message}</span>`)
      .buttons(this.buttons)
      .beforeClose(() => {
         if (info.beforeClose) {
           info.beforeClose();
         }
         return true;
      }).beforeOpen(() => {
         if (info.beforeOpen) {
           info.beforeOpen();
         }
         return true;
      }).opened(() => {
        if (info.opened) {
          info.opened();
        }
      })
      .open();
  }

  openError(error: AppError) {
    let dialogComponent: ErrorComponent;
    const dialogRef = this.modalService
      .modal<ErrorComponent>(ErrorComponent, this.errorPlaceholder)
      .cssClass('modal-error')
      .buttons([
        {
          text: this.translator.translate(this.translator.constants.CLOSE),
          click: (e, modal) => {
              dialogRef.close();
          },
          isDefault: true
        }
      ])
      .title(this.translator.translate(this.translator.constants.OPERATION_ERROR))
      .apply((component) => {
        dialogComponent = component;
      });
      dialogComponent.setError(error);
      dialogRef.open();
  }
}
