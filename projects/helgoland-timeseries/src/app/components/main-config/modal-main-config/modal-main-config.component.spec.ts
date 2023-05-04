import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HelgolandCommonModule } from 'helgoland-common';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { ModalMainConfigComponent } from './modal-main-config.component';

describe('ModalMainConfigComponent', () => {
  let component: ModalMainConfigComponent;
  let fixture: ComponentFixture<ModalMainConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        TranslateTestingModule,
        HttpClientModule,
        HelgolandCommonModule,
        NoopAnimationsModule,
        ModalMainConfigComponent
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
