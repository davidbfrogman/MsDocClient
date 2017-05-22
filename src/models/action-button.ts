import { ActionsType, ActionViewsType } from 'enumerations';

export class ActionButton {
  public visible: boolean;
  public enabled: boolean;
  public translationCode: string;
  public action: ActionsType;
  public icon?: string;
  public menu?: ActionButton[];
  public isMenuButton?: boolean;
  public id?: string;
}

