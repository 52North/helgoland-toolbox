import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearStorageComponent } from './clear-storage.component';

describe('ClearStorageComponent', () => {
  let component: ClearStorageComponent;
  let fixture: ComponentFixture<ClearStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearStorageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
