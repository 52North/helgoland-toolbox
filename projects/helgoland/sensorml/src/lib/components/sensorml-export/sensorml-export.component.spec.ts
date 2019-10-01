import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensormlExportComponent } from './sensorml-export.component';

describe('SensormlExportComponent', () => {
  let component: SensormlExportComponent;
  let fixture: ComponentFixture<SensormlExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensormlExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensormlExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
