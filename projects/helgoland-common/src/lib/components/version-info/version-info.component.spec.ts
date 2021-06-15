import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from './../../../../../testing/translate.testing.module';
import { VersionInfoComponent } from './version-info.component';

describe('VersionInfoComponent', () => {
  let component: VersionInfoComponent;
  let fixture: ComponentFixture<VersionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersionInfoComponent],
      imports: [
        TranslateTestingModule,
        HelgolandCoreModule,
        HttpClientModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
