import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GraphPanZoomInteractionComponent } from './d3-graph-pan-zoom-interaction.component';

describe('D3GraphPanZoomInteractionComponent', () => {
  let component: D3GraphPanZoomInteractionComponent;
  let fixture: ComponentFixture<D3GraphPanZoomInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GraphPanZoomInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GraphPanZoomInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
