import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { OlStationSelectorLayerComponent } from './ol-station-selector-layer.component';

describe('OlStationSelectorLayerComponent', () => {
  let component: OlStationSelectorLayerComponent;
  let fixture: ComponentFixture<OlStationSelectorLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OlStationSelectorLayerComponent],
      imports: [
        FormsModule,
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlStationSelectorLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
