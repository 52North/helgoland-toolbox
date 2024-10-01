import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../../testing/dataset-api-interface.testing';
import { SettingsServiceTestingProvider } from '../../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { MapCache } from '../../base/map-cache.service';
import { ProfileTrajectoryMapSelectorComponent } from './trajectory-map-selector.component';

describe('ProfileTrajectoryMapSelectorComponent', () => {
  let component: ProfileTrajectoryMapSelectorComponent;
  let fixture: ComponentFixture<ProfileTrajectoryMapSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule,
        ProfileTrajectoryMapSelectorComponent,
      ],
      providers: [
        DatasetApiInterfaceTesting,
        SettingsServiceTestingProvider,
        MapCache,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTrajectoryMapSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
