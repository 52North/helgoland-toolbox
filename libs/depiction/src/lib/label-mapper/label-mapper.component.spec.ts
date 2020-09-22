import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsService } from '@helgoland/core';

import { LabelMapperComponent } from './label-mapper.component';
import { LabelMapperService } from './label-mapper.service';

describe('LabelMapperComponent', () => {
  let component: LabelMapperComponent;
  let fixture: ComponentFixture<LabelMapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LabelMapperService, SettingsService],
      declarations: [LabelMapperComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
