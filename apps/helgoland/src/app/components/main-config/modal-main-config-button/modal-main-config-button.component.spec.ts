import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMainConfigButtonComponent } from './modal-main-config-button.component';

describe('ModalMainConfigButtonComponent', () => {
  let component: ModalMainConfigButtonComponent;
  let fixture: ComponentFixture<ModalMainConfigButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMainConfigButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMainConfigButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
