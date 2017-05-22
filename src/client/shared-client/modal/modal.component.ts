import { Component, OnInit } from '@angular/core';
import { SohoMessageService, SohoMessageRef } from '@infor/sohoxi-angular';
import { InfoEventBus, ErrorEventBus } from 'event-buses';
import { AppInfoModal, AppInfoAction, AppError } from 'models';

class AppInfoActionClickable extends AppInfoAction {
 public click: (message, modal) => void; 
}

@Component({
  selector: 'idm-soho-modal',
  template: ''
})
export class ModalComponent implements OnInit {

  dialog: SohoMessageRef;
  private defaultButton: AppInfoActionClickable;
  private buttons: AppInfoAction[];

  constructor(
    private messageService: SohoMessageService,
    private infoEventBus: InfoEventBus,
    private errorEventBus: ErrorEventBus
  ) {
    this.defaultButton = new AppInfoActionClickable();
    this.defaultButton.text = 'Close';
  }

  ngOnInit() {
    this.infoEventBus.modalEventAdded
      .subscribe(info => this.openInfo(info));
    this.errorEventBus.modalEventAdded
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
      let button = <AppInfoActionClickable>action;
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
      .title(['<span>', info.title, '</span>'].join(''))
      .message(['<span class="longer-message">', info.message, '</span>'].join(''))
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
    this.activateActionButtons([]);
    this.dialog = this.messageService
      .error()
      .title(['<span>', error.name, '</span>'].join(''))
      .message(error.message)
      .buttons(this.buttons)
      .open();
  }
}