import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListSettingsComponent } from './modal-list-settings.component';

describe('ModalListSettingsComponent', () => {
  let component: ModalListSettingsComponent;
  let fixture: ComponentFixture<ModalListSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalListSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
