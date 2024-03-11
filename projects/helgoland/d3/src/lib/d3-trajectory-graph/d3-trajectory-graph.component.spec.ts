import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph.component';

describe('D3TrajectoryGraphComponent', () => {
  let component: D3TrajectoryGraphComponent;
  let fixture: ComponentFixture<D3TrajectoryGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule,
        D3TrajectoryGraphComponent
    ],
    providers: [
        DatasetApiInterfaceTesting,
        SettingsServiceTestingProvider
    ]
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
