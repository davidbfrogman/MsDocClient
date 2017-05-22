
import { Action, Item } from 'models';
import { ActionsType } from 'enumerations';

export class ActionUtility {

  public static createNewAction(actionType: ActionsType, items: Item[]): Action {
    const newAction: Action = new Action();
    newAction.action = actionType;
    newAction.affectedItems = items;
    return newAction;
  }
}
