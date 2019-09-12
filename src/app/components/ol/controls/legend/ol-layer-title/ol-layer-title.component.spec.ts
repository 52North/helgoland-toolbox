import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLayerTitleComponent } from './ol-layer-title.component';

describe('OlLayerTitleComponent', () => {
  let component: OlLayerTitleComponent;
  let fixture: ComponentFixture<OlLayerTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlLayerTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
