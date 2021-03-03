import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ParameterListSelectorComponent } from './parameter-list-selector.component';

describe('ParameterListSelectorComponent', () => {
  let component: ParameterListSelectorComponent;
  let fixture: ComponentFixture<ParameterListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterListSelectorComponent],
      imports: [
        TranslateTestingModule,
        HelgolandCoreModule,
        HttpClientModule,
        MatListModule
      ]
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
