import { HelgolandSelectorModule } from '@helgoland/selector';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListSelectorComponent } from './service-list-selector.component';
import { MatListModule } from '@angular/material/list';

describe('ServiceListSelectorComponent', () => {
  let component: ServiceListSelectorComponent;
  let fixture: ComponentFixture<ServiceListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceListSelectorComponent],
      imports: [
        HelgolandSelectorModule,
        MatListModule
      ]
    }).compileComponents();
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
