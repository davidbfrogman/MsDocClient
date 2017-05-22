import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { TestingModule } from 'testing';

import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error.component';
import { PageNotFoundComponent } from './not-found.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ErrorComponent,
        PageNotFoundComponent
      ],
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
});
