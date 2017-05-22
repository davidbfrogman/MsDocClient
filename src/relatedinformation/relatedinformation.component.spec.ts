import {} from 'jasmine';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { SohoComponentsModule } from '@infor/sohoxi-angular';
import { RelatedinformationComponent } from './relatedinformation.component';
import { TestingModule } from 'testing';

describe('RelatedinformationComponent', () => {
  let component: RelatedinformationComponent;
  let fixture: ComponentFixture<RelatedinformationComponent>;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(RelatedinformationComponent);
    component    = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
