import { ActionsType } from 'enumerations';
import { Item } from 'models';

export class Action {
  public action: ActionsType;
  affectedItems: Item[];
}

