import {} from 'jasmine';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { PreviewComponent } from './preview.component';

describe('PreviewComponent', () => {
  let fixture: ComponentFixture<PreviewComponent>;
  let component: PreviewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewComponent
      ]
    });
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));
});
