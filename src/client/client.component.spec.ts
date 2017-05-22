import { TestBed, ComponentFixture, inject } from '@angular/core/testing';

import { TestingModule } from 'testing';

import { ModalComponent } from './shared-client/modal/modal.component';
import { ClientComponent } from 'client/client.component';
import { ServiceUtilityComponent } from 'client/service-utility/service-utility.component';
import { AddDocumentComponent } from 'client/document-details/add-document/add-document.component';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddDocumentComponent,
        ClientComponent,
        ModalComponent,
        ServiceUtilityComponent
      ],
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;

    it('should create the app', () => {
      expect(component).toBeTruthy();
    });
  });

});
