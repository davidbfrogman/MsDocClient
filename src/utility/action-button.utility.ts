
import { ActionButton } from 'models';
import { ActionsType, ActionViewsType } from 'enumerations';

export class ActionButtonUtility {
  private static save = <ActionButton>{visible: true, enabled: true, translationCode: 'SAVE', action: ActionsType.Save, icon: 'save' };       // tslint:disable:max-line-length
  private static display = <ActionButton>{visible: true, enabled: true, translationCode: 'DISPLAY', action: ActionsType.Display, icon: 'display' }; // tslint:disable:max-line-length
  private static checkIn = <ActionButton>{visible: true, enabled: true, translationCode: 'CHECK_IN', action: ActionsType.CheckIn, icon: 'idm-checkIn' }; // tslint:disable:max-line-length
  private static discardCheckout = <ActionButton>{visible: true, enabled: true, translationCode: 'DISCARD_CHECK_OUT', action: ActionsType.DiscardCheckOut, icon: 'idm-discardCheckOut' }; // tslint:disable:max-line-length
  private static checkOut = <ActionButton>{visible: true, enabled: true, translationCode: 'CHECK_OUT', action: ActionsType.CheckOut, icon: 'idm-checkOut' }; // tslint:disable:max-line-length
  private static download = <ActionButton>{visible: true, enabled: true, translationCode: 'DOWNLOAD', action: ActionsType.Download, icon: 'download',  // tslint:disable:max-line-length
    menu: [{visible: true, enabled: true, translationCode: 'DOWNLOAD_PDF', action: ActionsType.DownloadPdf}]}; // tslint:disable:max-line-length
  private static saveToIdm = <ActionButton>{visible: true, enabled: true, translationCode: 'SAVE_TO_IDM', action: ActionsType.SaveToIdm, icon: 'idm-saveToIdm' }; // tslint:disable:max-line-length
  private static print = <ActionButton>{visible: true, enabled: true, translationCode: 'PRINT', action: ActionsType.PrintPdf, icon: 'idm-printPdf' }; // tslint:disable:max-line-length
  private static delete = <ActionButton>{visible: true, enabled: true, translationCode: 'DELETE', action: ActionsType.Delete, icon: 'delete' }; // tslint:disable:max-line-length
  private static copy = <ActionButton>{visible: true, enabled: true, translationCode: 'COPY', action: ActionsType.Copy, icon: 'copy' }; // tslint:disable:max-line-length
  private static refresh = <ActionButton>{visible: true, enabled: true, translationCode: 'REFRESH_ITEM', action: ActionsType.Refresh, icon: 'sync' }; // tslint:disable:max-line-length
  private static startWorkflow = <ActionButton>{visible: true, enabled: true, translationCode: 'WORKFLOW_START_NAME', action: ActionsType.StartWorkflow, icon: 'workflow' }; // tslint:disable:max-line-length

  public static getActionButtons(actionView: ActionViewsType, uniqueExtension: string ): ActionButton[] {
    let actionButtons: ActionButton[] = [];

    if (actionView === ActionViewsType.SearchResult) {
      // If button should be visible on Search result add button here
      actionButtons = [
        this.display,
        this.checkIn,
        this.discardCheckout,
        this.checkOut,
        // this.download,
        // this.saveToIdm,
        // this.print,
        // this.delete,
        // this.copy
        ];
    } else if (actionView === ActionViewsType.Details) {
      // If button should be visible on Document Details add button here
      actionButtons = [
        this.save,
        this.checkIn,
        this.discardCheckout,
        this.checkOut
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
}
