import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { MapCache } from '../../base/map-cache.service';
import { ProfileTrajectoryMapSelectorComponent } from './trajectory-map-selector.component';

describe('ProfileTrajectoryMapSelectorComponent', () => {
  let component: ProfileTrajectoryMapSelectorComponent;
  let fixture: ComponentFixture<ProfileTrajectoryMapSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting,
        MapCache
      ],
      declarations: [ProfileTrajectoryMapSelectorComponent]
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
