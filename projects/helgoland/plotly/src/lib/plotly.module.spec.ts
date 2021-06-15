import { TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandPlotlyModule } from './plotly.module';

describe('PlotlyModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandPlotlyModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandPlotlyModule).toBeDefined();
  });
});
