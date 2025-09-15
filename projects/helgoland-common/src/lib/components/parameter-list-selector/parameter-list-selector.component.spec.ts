import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ParameterListSelectorComponent } from './parameter-list-selector.component';

describe('ParameterListSelectorComponent', () => {
  let component: ParameterListSelectorComponent;
  let fixture: ComponentFixture<ParameterListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        MatListModule,
        MatProgressBarModule,
        TranslateTestingModule,
        ParameterListSelectorComponent,
      ],
      providers: [provideHttpClient(withInterceptorsFromDi())],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
