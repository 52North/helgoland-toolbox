import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';

import { ShareButtonComponent } from './share-button.component';

describe('ShareButtonComponent', () => {
  let component: ShareButtonComponent;
  let fixture: ComponentFixture<ShareButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatIconModule,
        MatTooltipModule,
        TranslateTestingModule,
        ShareButtonComponent
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
