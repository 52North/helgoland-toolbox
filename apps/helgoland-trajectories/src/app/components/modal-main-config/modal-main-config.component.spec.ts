import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HelgolandCommonModule } from '../../../../../../libs/helgoland-common/src/lib/helgoland-common.module';
import { TranslateTestingModule } from './../../../../../../libs/testing/translate.testing.module';
import { ModalMainConfigComponent } from './modal-main-config.component';

describe('ModalMainConfigComponent', () => {
  let component: ModalMainConfigComponent;
  let fixture: ComponentFixture<ModalMainConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalMainConfigComponent],
      imports: [
        TranslateTestingModule,
        BrowserAnimationsModule,
        HelgolandCommonModule,
        HttpClientModule
      ]
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
