import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsService } from '@helgoland/core';

import { RefreshButtonComponent } from './refresh-button.component';

describe('RefreshButtonComponent', () => {
  let component: RefreshButtonComponent;
  let fixture: ComponentFixture<RefreshButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RefreshButtonComponent],
      providers: [SettingsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
