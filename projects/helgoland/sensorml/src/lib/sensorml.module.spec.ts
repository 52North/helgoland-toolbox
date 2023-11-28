import { TestBed, waitForAsync } from "@angular/core/testing";

import { HelgolandSensormlModule } from "./sensorml.module";

describe("SensormlModule", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandSensormlModule],
    }).compileComponents();
  }));

  it("should create", () => {
    expect(HelgolandSensormlModule).toBeDefined();
  });
});
