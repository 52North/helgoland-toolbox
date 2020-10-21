import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionInfoComponent } from './version-info.component';

describe('VersionInfoComponent', () => {
  let component: VersionInfoComponent;
  let fixture: ComponentFixture<VersionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
