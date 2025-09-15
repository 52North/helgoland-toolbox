import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelgolandCommonModule } from 'helgoland-common';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ModalMainConfigComponent } from './modal-main-config.component';

describe('ModalMainConfigComponent', () => {
  let component: ModalMainConfigComponent;
  let fixture: ComponentFixture<ModalMainConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        BrowserAnimationsModule,
        HelgolandCommonModule,
        ModalMainConfigComponent,
      ],
      providers: [provideHttpClient(withInterceptorsFromDi())],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMainConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
