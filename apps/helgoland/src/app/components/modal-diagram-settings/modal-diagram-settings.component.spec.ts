import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDiagramSettingsComponent } from './modal-diagram-settings.component';

describe('ModalDiagramSettingsComponent', () => {
  let component: ModalDiagramSettingsComponent;
  let fixture: ComponentFixture<ModalDiagramSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDiagramSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDiagramSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
