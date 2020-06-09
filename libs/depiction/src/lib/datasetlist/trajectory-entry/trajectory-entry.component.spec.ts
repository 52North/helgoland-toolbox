import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { SettingsServiceTestingProvider } from './../../../../../testing/settings.testing';
import { TrajectoryEntryComponent } from './trajectory-entry.component';

describe('TrajectoryEntryComponent', () => {
  let component: TrajectoryEntryComponent;
  let fixture: ComponentFixture<TrajectoryEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting,
        SettingsServiceTestingProvider
      ],
      declarations: [TrajectoryEntryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
