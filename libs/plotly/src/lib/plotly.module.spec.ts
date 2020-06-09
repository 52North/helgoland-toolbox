import { async, TestBed } from '@angular/core/testing';

import { HelgolandPlotlyModule } from './plotly.module';

describe('PlotlyModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandPlotlyModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandPlotlyModule).toBeDefined();
  });
});
