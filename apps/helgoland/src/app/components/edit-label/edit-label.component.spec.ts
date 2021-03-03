import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { EditLabelComponent } from './edit-label.component';

describe('EditLabelComponent', () => {
  let component: EditLabelComponent;
  let fixture: ComponentFixture<EditLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLabelComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
