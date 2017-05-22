import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { CardListComponent } from './card-list.component';

describe('CardListComponent', () => {
  let component: CardListComponent;
  let fixture: ComponentFixture<CardListComponent>;

  beforeAll(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });
    fixture = TestBed.createComponent(CardListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

});
