import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensormlImportComponent } from './sensorml-import.component';

describe('SensormlImportComponent', () => {
  let component: SensormlImportComponent;
  let fixture: ComponentFixture<SensormlImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensormlImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensormlImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
