import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandPlotlyModule } from '../plotly.module';
import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { PlotlyProfileGraphComponent } from './plotly-profile-graph.component';

describe('PlotlyProfileGraphComponent', () => {
  let component: PlotlyProfileGraphComponent;
  let fixture: ComponentFixture<PlotlyProfileGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientModule,
        TranslateTestingModule,
        HelgolandPlotlyModule
    ],
    providers: [
        DatasetApiInterfaceTesting,
        SettingsServiceTestingProvider
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyProfileGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
