import { } from 'jasmine';
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { CacheService } from '../services/cache/cache.service';
import { CacheServiceConfigType } from 'services';
import { CacheEventType } from 'enumerations';
import { CacheEventBus } from 'event-buses';

describe('CacheEventBus', () => {
  let cacheEventBus: CacheEventBus;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cacheEventBus = new CacheEventBus();
  });

  it('should set a key', async(() => {
    const key: string = 'key';
    const setValue: string = 'value';
    const options: CacheServiceConfigType = {
        cache: true
    };

    const result: boolean = cacheEventBus.set(key, setValue, options);
    expect(result).toEqual(true);

    const getValue: any = cacheEventBus.get(key, options);
    expect(getValue).toEqual(setValue);
  }));

  it('should not set a key with a tag', async(() => {
    const key: string = 'key';
    const setValue: string = 'value';
    const options: CacheServiceConfigType = { cache: true, tag: 'tag' };
    const result: boolean = cacheEventBus.set(key, setValue, options);
    expect(result).toEqual(true);
    const getValue: any = cacheEventBus.get(key, options);
    expect(getValue).toEqual(setValue);
  }));

  it('should set 2 different tags', async(() => {
    const key1: string = 'key1';
    const key2: string = 'key1';
    const setValue1: string = 'value1';
    const setValue2: string = 'value2';
    const options1: CacheServiceConfigType = { cache: true, tag: 'tag1'};
    const options2: CacheServiceConfigType = { cache: true, tag: 'tag2'};
    let result: boolean;
    let getValue: string;

    result = cacheEventBus.set(key1, setValue1, options1);
    expect(result).toEqual(true);

    result = cacheEventBus.set(key2, setValue2, options2);
    expect(result).toEqual(true);

    getValue = cacheEventBus.get(key2, options1);
    expect(result).toEqual(true);

    getValue = cacheEventBus.get(key2, options2);
    expect(getValue).toEqual(setValue2);
  }));

  it('should not set a key when options.cache is off', async(() => {
    const key: string = 'key';
    const setValue: string = 'value';
    const options: CacheServiceConfigType = { cache: false };

    const result: boolean = cacheEventBus.set(key, setValue, options);
    expect(result).toEqual(null);

    const getValue: any = cacheEventBus.get(key, options);
    expect(getValue).toEqual(null);
  }));

  it('should not set a key when options.cache is undefined', async(() => {
    const key: string = 'key';
    const setValue: string = 'value';
    const options: CacheServiceConfigType = { cache: undefined };
    const result: boolean = cacheEventBus.set(key, setValue, options);
    expect(result).toEqual(null);
    const getValue: any = cacheEventBus.get(key, options);
    expect(getValue).toEqual(null);
  }));

  it('should not get a key when removeTag', async(() => {
    const key: string = 'key';
    const setValue: string = 'value';
    const options: CacheServiceConfigType = { cache: true, tag: 'tag' };
    const result: boolean = cacheEventBus.set(key, setValue, options);
    expect(result).toEqual(true);
    let getValue: any = cacheEventBus.get(key, options);
    expect(getValue).toEqual(setValue);
    cacheEventBus.removeTag(options.tag);
    getValue = cacheEventBus.get(key, options);
    expect(getValue).toEqual(null);
  }));

  it('should not get a key when removeAll', async(() => {
    const key: string = 'key';
    const setValue: string = 'value';
    const options: CacheServiceConfigType = { cache: true, tag: 'tag' };
    const result: boolean = cacheEventBus.set(key, setValue, options);
    expect(result).toEqual(true);
    let getValue: any = cacheEventBus.get(key, options);
    expect(getValue).toEqual(setValue);
    cacheEventBus.removeAll();
    getValue = cacheEventBus.get(key, options);
    expect(getValue).toEqual(null);
  }));

  it('should not get a key when key expired', async(() => {
    const key: string = 'key';
    const setValue: string = 'value';
    const options: CacheServiceConfigType = { cache: true, tag: 'tag', expires: (Date.now() - 1) };
    const result: boolean = cacheEventBus.set(key, setValue, options);
    expect(result).toEqual(true);

    const getValue: any = cacheEventBus.get(key, options);
    expect(getValue).toEqual(null);
  }));

  it('should not get a key for maxAge 1 second', ((done) => {
    const key: string = 'key';
    const setValue: string = 'value';
    const options: CacheServiceConfigType = { cache: true, tag: 'tag', maxAge: 100 };
    const result: boolean = cacheEventBus.set(key, setValue, options);
    expect(result).toEqual(true);
    let getValue: any = cacheEventBus.get(key, options);
    expect(getValue).toEqual(setValue);
    getValue = cacheEventBus.get(key, options);
    setTimeout(() => {
      done();
      getValue = cacheEventBus.get(key, options);
      expect(getValue).toEqual(null);
    }, 101);
  }));
});
