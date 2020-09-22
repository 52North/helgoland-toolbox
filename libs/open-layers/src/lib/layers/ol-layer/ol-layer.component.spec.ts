import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OlLayerComponent } from './ol-layer.component';

describe('OlLayerComponent', () => {
  let component: OlLayerComponent;
  let fixture: ComponentFixture<OlLayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OlLayerComponent]
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
