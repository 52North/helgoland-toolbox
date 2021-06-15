import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DatasetApiV1ConnectorProvider, DatasetApiV3ConnectorProvider, DatasetStaConnectorProvider } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { D3GeneralGraphComponent } from './d3-general-graph.component';

describe('D3GeneralGraphComponent', () => {
  let component: D3GeneralGraphComponent;
  let fixture: ComponentFixture<D3GeneralGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [D3GeneralGraphComponent],
      imports: [
        HttpClientModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiV1ConnectorProvider,
        DatasetApiV3ConnectorProvider,
        DatasetStaConnectorProvider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GeneralGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
