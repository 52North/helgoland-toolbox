import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLayerComponent } from './ol-layer.component';

describe('OlLayerComponent', () => {
  let component: OlLayerComponent;
  let fixture: ComponentFixture<OlLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
