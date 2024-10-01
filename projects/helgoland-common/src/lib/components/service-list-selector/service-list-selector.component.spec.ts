import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HelgolandSelectorModule } from '@helgoland/selector';

import { TranslateTestingModule } from './../../../../../testing/translate.testing.module';
import { ServiceListSelectorComponent } from './service-list-selector.component';

describe('ServiceListSelectorComponent', () => {
  let component: ServiceListSelectorComponent;
  let fixture: ComponentFixture<ServiceListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HelgolandSelectorModule,
        MatListModule,
        MatProgressBarModule,
        TranslateTestingModule,
        ServiceListSelectorComponent,
      ],
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
