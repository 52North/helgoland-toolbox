import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { TimeseriesSymbolSelectComponent } from './timeseries-symbol-select.component';

/* tslint:disable:no-unused-variable */
describe('TimeseriesSymbolSelectComponent', () => {
  let component: TimeseriesSymbolSelectComponent;
  let fixture: ComponentFixture<TimeseriesSymbolSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimeseriesSymbolSelectComponent],
      imports: [
        TranslateTestingModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesSymbolSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
