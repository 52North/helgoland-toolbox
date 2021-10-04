import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { D3SeriesGraphWrapperComponent } from './d3-series-graph-wrapper.component';

/* tslint:disable:no-unused-variable */
describe('D3SeriesGraphWrapperComponent', () => {
  let component: D3SeriesGraphWrapperComponent;
  let fixture: ComponentFixture<D3SeriesGraphWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      declarations: [D3SeriesGraphWrapperComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SeriesGraphWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
