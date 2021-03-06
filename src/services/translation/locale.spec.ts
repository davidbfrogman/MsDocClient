
import {} from 'jasmine';
import { TestBed, async, inject } from '@angular/core/testing';
import { URLSearchParams } from '@angular/http';
import { Locale } from 'services';
import { Constants } from '../../constants';

const mockNavigatorLanguage = (locale: string) => {
  Object.defineProperty(navigator, 'languages', {
      get: function() { return [locale]; }
  });
};

describe('Locale', () => {
  let localeService: Locale;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Locale
      ]
    });
    localeService = new Locale();
  });

  it('should instantiate ...', () => {
    expect(localeService).toBeTruthy();
  });

  it('should detect migle locale de ...', () => {
    const urlSearchParams: URLSearchParams = new URLSearchParams('inforCurrentLanguage=de');
    expect(localeService.detectLocale(urlSearchParams)).toEqual('de');
  });

  it('should detect idm locale de ...', () => {
    const urlSearchParams: URLSearchParams = new URLSearchParams('$language=de');
    expect(localeService.detectLocale(urlSearchParams)).toEqual('de');
  });

  it('should detect navigator locale de ...', () => {
    const urlSearchParams: URLSearchParams = new URLSearchParams();
    mockNavigatorLanguage('de');
    expect(localeService.detectLocale(urlSearchParams)).toEqual('de');
  });

 it('should detect ar and switch to default ...', () => {
    const urlSearchParams: URLSearchParams = new URLSearchParams();
    mockNavigatorLanguage('ar');
    expect(localeService.detectLocale(urlSearchParams)).toEqual(Constants.LOCALE_DEFAULT_LOCALE);
  });
});
