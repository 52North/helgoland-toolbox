import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMapSettingsComponent } from './modal-map-settings.component';

describe('ModalMapSettingsComponent', () => {
  let component: ModalMapSettingsComponent;
  let fixture: ComponentFixture<ModalMapSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMapSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
