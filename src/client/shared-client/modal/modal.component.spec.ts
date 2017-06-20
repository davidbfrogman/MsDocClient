import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { SohoMessageService, SohoMessageRef, SohoModalDialogService } from '@infor/sohoxi-angular';
import { ModalComponent } from './modal.component';
import { InfoEventBus, ErrorEventBus } from 'event-buses';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ TestingModule ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('open info modal', () => {
    expect(component.dialog).toBeUndefined();
    component.openInfo({
      title: 'Title',
      message: 'Message'
    });
    expect(component.dialog).toBeDefined();
  });
});
