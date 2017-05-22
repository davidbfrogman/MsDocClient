import {} from 'jasmine';
import { environment } from '../../environments/environment';
import { TestBed, async } from '@angular/core/testing';
import { RestUrlBuilder } from '../';

describe('RestUrlBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create url with url and suffix', async(() => {
    const rootApiUrl = environment.restUrls['ca'];
    const builder = new RestUrlBuilder();
    builder
      .setRootApiUrl(rootApiUrl)
      .setUrlSuffix('item');
    const urlBuilt = builder.build();
    const urltoBuild = `${rootApiUrl}item`;
    expect(urlBuilt).toEqual(urltoBuild);
  }));

  it('should create url with id and operation', async(() => {
    const rootApiUrl = environment.restUrls['ca'];
    const builder = new RestUrlBuilder()
      .setRootApiUrl(rootApiUrl)
      .setUrlSuffix('item');
    const urlBuilt = builder
      .withConfig({id: '3', operation: 'checkout'})
      .build();
    const urltoBuild = `${rootApiUrl}item/3/checkout`;
    expect(urlBuilt).toEqual(urltoBuild);
  }));

  it('should create url just with suffix', async(() => {
    const rootApiUrl = environment.restUrls['ca'];
    const builder = new RestUrlBuilder()
      .setRootApiUrl(rootApiUrl)
      .setUrlSuffix('item');
    const urlBuilt = builder.build();
    const urltoBuild = `${rootApiUrl}item`;
    expect(urlBuilt).toEqual(urltoBuild);
  }));

  it('should create url with overloaded url suffix', async(() => {
    const rootApiUrl = environment.restUrls['ca'];
    const builder = new RestUrlBuilder();
    builder
      .setRootApiUrl(rootApiUrl)
      .setUrlSuffix('item');
    const urlBuilt = builder
      .withConfig({urlSuffix: 'items'})
      .build()
      ;
    const urltoBuild = `${rootApiUrl}items`;
    expect(urlBuilt).toEqual(urltoBuild);
  }));

  
  it('should create url with plural url suffix', async(() => {
    const rootApiUrl = environment.restUrls['ca'];
    const builder = new RestUrlBuilder();
    builder
      .setRootApiUrl(rootApiUrl)
      .setUrlSuffix('item')
      .setUrlSuffixPlural('items');
    const urlBuilt = builder
      .withConfig({usePlural: true})
      .build()
      ;
    const urltoBuild = `${rootApiUrl}items`;
    expect(urlBuilt).toEqual(urltoBuild);
  }));
});
