import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MapCache } from '../../base/map-cache.service';
import { GeosearchControlComponent } from './geosearch.component';
import { GeoSearch } from '../../base/geosearch/geosearch';

describe('GeosearchComponent', () => {
  let component: GeosearchControlComponent;
  let fixture: ComponentFixture<GeosearchControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MapCache,
        GeoSearch
      ],
      imports: [
        FormsModule
      ],
      declarations: [GeosearchControlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeosearchControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
