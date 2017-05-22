export class AppInfo {
  public title: string;
  public message: string;
}

export class AppInfoModal extends AppInfo {
  public actions?: AppInfoAction[];
  public beforeClose?: () => void;
  public beforeOpen?: () => void;
  public opened?: () => void;
}

export class AppInfoAction {
  public text: string;
  public isDefault: boolean = false;
  public run: () => void;
}
