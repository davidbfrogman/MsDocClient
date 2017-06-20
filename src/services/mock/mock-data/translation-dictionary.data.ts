import { TranslationDictionary } from 'models';

export class TranslationDictionaryData extends TranslationDictionary {
    public CheckedOutBy: string = 'Checked Out By';
    public Search: string = 'Search';
    public Add: string = 'Add';
    public Save: string = 'Save';
    public AnnotationsLoading: string = 'Loading ...';
    public DiscardAnyLocalChanges: string = 'Any local changes that the user {0} has made will be lost.';
    public AccessControlList: string = 'Access Control List';
    public Size: string = 'Size';

  constructor() {
      super();
  }
}

