import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';

import { ThumbnailListComponent } from './thumbnail-list.component';

describe('ThumbnailListComponent', () => {
  let fixture: ComponentFixture<ThumbnailListComponent>;
  let component: ThumbnailListComponent;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(ThumbnailListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

});
