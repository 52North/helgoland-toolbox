import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsService } from '@helgoland/core';

import { LabelMapperComponent } from './label-mapper.component';
import { LabelMapperService } from './label-mapper.service';

describe('LabelMapperComponent', () => {
  let component: LabelMapperComponent;
  let fixture: ComponentFixture<LabelMapperComponent>;

  beforeEach(async(() => {
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
