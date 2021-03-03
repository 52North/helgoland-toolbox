import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateTestingModule } from '../../../../../../../libs/testing/translate.testing.module';
import { ModalMainConfigButtonComponent } from './modal-main-config-button.component';

describe('ModalMainConfigButtonComponent', () => {
  let component: ModalMainConfigButtonComponent;
  let fixture: ComponentFixture<ModalMainConfigButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalMainConfigButtonComponent
      ],
      imports: [
        MatDialogModule,
        TranslateTestingModule,
        HttpClientModule,
        MatIconModule,
        MatTooltipModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMainConfigButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
