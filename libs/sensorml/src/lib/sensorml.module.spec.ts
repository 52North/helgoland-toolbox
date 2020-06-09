import { async, TestBed } from '@angular/core/testing';
import { HelgolandSensormlModule } from './sensorml.module';

describe('SensormlModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandSensormlModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandSensormlModule).toBeDefined();
  });
});
