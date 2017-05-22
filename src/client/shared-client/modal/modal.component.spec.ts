import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SohoMessageService, SohoMessageRef } from '@infor/sohoxi-angular';
import { ModalComponent } from './modal.component';
import { InfoEventBus, ErrorEventBus } from 'event-buses';

describe('DocumentDetailsComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        ModalComponent
      ],
      providers: [
        SohoMessageService,
        InfoEventBus,
        ErrorEventBus
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  describe('Test simple operations', () => {
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

    it('open error modal', () => {
      expect(component.dialog).toBeUndefined();
      component.openError({
        name: 'Title',
        message: 'Message',
        description: '',
        statusCode: 1,
        statusText: ''
      });
      expect(component.dialog).toBeDefined();
    });
  });
});
