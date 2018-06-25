import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { PlotlyProfileGraphComponent } from './plotly-profile-graph.component';

describe('PlotlyProfileGraphComponent', () => {
  let component: PlotlyProfileGraphComponent;
  let fixture: ComponentFixture<PlotlyProfileGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateTestingModule,
        HelgolandCoreModule
      ],
      providers: [
        DatasetApiInterfaceTesting
      ],
      declarations: [PlotlyProfileGraphComponent]
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
