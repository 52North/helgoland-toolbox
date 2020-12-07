import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDiagramSettingsComponent } from './modal-diagram-settings.component';

describe('ModalDiagramSettingsComponent', () => {
  let component: ModalDiagramSettingsComponent;
  let fixture: ComponentFixture<ModalDiagramSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDiagramSettingsComponent]
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
