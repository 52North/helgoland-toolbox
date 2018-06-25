import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { MapCache } from '../../base/map-cache.service';
import { StationMapSelectorComponent } from './station-map-selector.component';

describe('StationMapSelectorComponent', () => {
  let component: StationMapSelectorComponent;
  let fixture: ComponentFixture<StationMapSelectorComponent>;

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
      declarations: [StationMapSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationMapSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
