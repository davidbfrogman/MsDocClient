import {} from 'jasmine';
import { TestBed, async, inject } from '@angular/core/testing';
import { Translator } from 'services';
import { TranslationDictionaryData } from '../mock';
import { Constants, TranslationConstants } from '../../constants';

describe('Translator', () => {
  let translator: Translator;
  let translationDictionaryMock: TranslationDictionaryData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Translator
      ]
    });

    translator = new Translator();
    translationDictionaryMock = new TranslationDictionaryData();
    translator
      .setCurrentLocale('en')
      .setTranslationDictionary(translationDictionaryMock);
  });

  it('should instantiate ...', () => {
    expect(translator).toBeTruthy();
  });

  it('should translate missing translation ...', () => {
    const name = 'MissingTranslationKey';
    const translated: string = translator.translate(name);
    expect(translated).toEqual('MissingTranslationKey');
  });

  it('should translate loading ...', () => {
    const name = 'AnnotationsLoading';
    const translated: string = translator.translate(name);
    expect(translated).toEqual('Loading ...');
  });

  it('should translate with param ...', () => {
    const name = 'DiscardAnyLocalChanges';
    const translated: string = translator.translate(name, 'User');
    expect(translated).toEqual('Any local changes that the user User has made will be lost.');
  });

});
