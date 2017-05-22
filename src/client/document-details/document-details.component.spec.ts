import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';

import { DocumentDetailsComponent } from './document-details.component';
import { ItemService } from 'services';
import { Item } from 'models';

describe('DocumentDetailsComponent', () => {
  let fixture: ComponentFixture<DocumentDetailsComponent>;
  let component: DocumentDetailsComponent;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });
    fixture = TestBed.createComponent(DocumentDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
