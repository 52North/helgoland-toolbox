import { ColorPickerModule } from 'ngx-color-picker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateTestingModule } from './../../../../../../libs/testing/translate.testing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { LegendEntryComponent } from './legend-entry.component';

describe('LegendEntryComponent', () => {
  let component: LegendEntryComponent;
  let fixture: ComponentFixture<LegendEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegendEntryComponent],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        MatCheckboxModule,
        MatIconModule,
        ColorPickerModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
