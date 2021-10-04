import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';

import { D3SeriesGraphComponent } from './d3-series-graph.component';

/* tslint:disable:no-unused-variable */
describe('D3SeriesGraphComponent', () => {
  let component: D3SeriesGraphComponent;
  let fixture: ComponentFixture<D3SeriesGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      declarations: [D3SeriesGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SeriesGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
