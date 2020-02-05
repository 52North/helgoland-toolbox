import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { SettingsServiceTestingProvider } from './../../../../../testing/settings.testing';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph.component';

describe('D3TrajectoryGraphComponent', () => {
  let component: D3TrajectoryGraphComponent;
  let fixture: ComponentFixture<D3TrajectoryGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting,
        SettingsServiceTestingProvider
      ],
      declarations: [D3TrajectoryGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TrajectoryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
