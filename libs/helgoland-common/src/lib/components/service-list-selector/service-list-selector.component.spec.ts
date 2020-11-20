import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListSelectorComponent } from './service-list-selector.component';

describe('ServiceListSelectorComponent', () => {
  let component: ServiceListSelectorComponent;
  let fixture: ComponentFixture<ServiceListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceListSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
