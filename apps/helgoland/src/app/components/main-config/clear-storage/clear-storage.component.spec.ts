import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from './../../../../../../../libs/testing/translate.testing.module';
import { ClearStorageComponent } from './clear-storage.component';

describe('ClearStorageComponent', () => {
  let component: ClearStorageComponent;
  let fixture: ComponentFixture<ClearStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClearStorageComponent],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
