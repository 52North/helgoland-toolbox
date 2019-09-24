import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlOverviewMapComponent } from './ol-overview-map.component';

describe('OlOverviewMapComponent', () => {
  let component: OlOverviewMapComponent;
  let fixture: ComponentFixture<OlOverviewMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlOverviewMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlOverviewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
