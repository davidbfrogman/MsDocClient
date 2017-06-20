
import { ActionButton } from 'models';
import { ActionsType, ActionViewsType } from 'enumerations';
import { TranslationConstants } from '../constants';

export class ActionButtonUtility {
  private static print = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.PRINT, action: ActionsType.PrintPdf, icon: 'idm-printPdf' }; // tslint:disable:max-line-length
  private static save = <ActionButton>{visible: true, enabled: false, translationCode: TranslationConstants.SAVE, action: ActionsType.Save, icon: 'save' };       // tslint:disable:max-line-length
  private static display = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.DISPLAY, action: ActionsType.Display, icon: 'display' }; // tslint:disable:max-line-length
  private static checkIn = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.CHECK_IN, action: ActionsType.CheckIn, icon: 'idm-checkIn' }; // tslint:disable:max-line-length
  private static discardCheckout = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.DISCARD_CHECK_OUT, action: ActionsType.DiscardCheckOut, icon: 'idm-discardCheckOut' }; // tslint:disable:max-line-length
  private static checkOut = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.CHECK_OUT, action: ActionsType.CheckOut, icon: 'idm-checkOut' }; // tslint:disable:max-line-length
  private static download = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.DOWNLOAD, action: ActionsType.Download, icon: 'download',  // tslint:disable:max-line-length
    menu: [{visible: true, enabled: true, translationCode: 'DOWNLOAD_PDF', action: ActionsType.DownloadPdf}]}; // tslint:disable:max-line-length
  private static saveToIdm = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.SAVE_TO_IDM, action: ActionsType.SaveToIdm, icon: 'idm-saveToIdm' }; // tslint:disable:max-line-length
  private static delete = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.DELETE, action: ActionsType.Delete, icon: 'delete' }; // tslint:disable:max-line-length
  private static copy = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.COPY, action: ActionsType.Copy, icon: 'copy' }; // tslint:disable:max-line-length
  private static refresh = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.REFRESH_ITEM, action: ActionsType.Refresh, icon: 'sync' }; // tslint:disable:max-line-length
  private static startWorkflow = <ActionButton>{visible: true, enabled: true, translationCode: TranslationConstants.WORKFLOW_START_NAME, action: ActionsType.StartWorkflow, icon: 'workflow' }; // tslint:disable:max-line-length

  public static getActionButtons(actionView: ActionViewsType, uniqueExtension: string ): ActionButton[] {
    let actionButtons: Array<ActionButton> = new Array<ActionButton>();

    if (actionView === ActionViewsType.SearchResult) {
      // If button should be visible on Search result add button here
      actionButtons = [
        this.cloneButton(this.display),
        this.cloneButton(this.checkIn),
        this.cloneButton(this.discardCheckout),
        this.cloneButton(this.checkOut),
        // this.download,
        // this.saveToIdm,
        // this.print,
        // this.delete,
        // this.copy
        ];
    } else if (actionView === ActionViewsType.Details) {
      // If button should be visible on Document Details add button here
      actionButtons = [
        this.cloneButton(this.save),
        this.cloneButton(this.checkIn),
        this.cloneButton(this.discardCheckout),
        this.cloneButton(this.checkOut)
        // this.download,
        // this.saveToIdm,
        // this.print,
        // this.delete,
        // this.copy,
        // this.refresh,
        // this.startWorkflow
        ];
    }
    actionButtons.forEach(button => {
      button.id = 'button' + actionView + '_' + button.action + '_' + uniqueExtension;
      button.isMenuButton = button.menu && button.menu.length > 0;
    });
    return actionButtons;
  }
  private static cloneButton(button: ActionButton): ActionButton {
    const newButton = new ActionButton();
    newButton.action = button.action;
    newButton.enabled = button.enabled;
    newButton.icon = button.icon;
    newButton.id = button.id;
    newButton.isMenuButton = button.isMenuButton;
    if (button.menu) {
      newButton.menu = new Array<ActionButton>();
      button.menu.forEach(menuButton => {
        newButton.menu.push(this.cloneButton(menuButton));
      });
    }
    newButton.translationCode = button.translationCode;
    newButton.visible = button.visible;
    return newButton;
  }
}
