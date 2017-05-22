import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';

import { AdvancedSearchComponent } from './advanced-search.component';
import { ItemService } from 'services';
import { Item } from 'models';

describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
