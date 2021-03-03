import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { MapSelectionViewComponent } from './map-selection-view.component';

describe('MapSelectionViewComponent', () => {
  let component: MapSelectionViewComponent;
  let fixture: ComponentFixture<MapSelectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapSelectionViewComponent],
      imports: [
        MatDialogModule,
        HelgolandCoreModule,
        RouterTestingModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSelectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
