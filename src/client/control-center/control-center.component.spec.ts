import { } from 'jasmine';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { ControlCenterComponent } from './control-center.component';

describe('ControlCenterComponent', () => {
  let fixture: ComponentFixture<ControlCenterComponent>;
  let component: ControlCenterComponent;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [
        ControlCenterComponent
      ]
    });
    fixture = TestBed.createComponent(ControlCenterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

});
