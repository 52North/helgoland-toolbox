import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandFavoriteModule } from '@helgoland/favorite';

import { TranslateTestingModule } from '../../../../../../libs/testing/translate.testing.module';
import { HelgolandCommonModule } from './../../../../../../libs/helgoland-common/src/lib/helgoland-common.module';
import {
  ModalFavoriteListButtonComponent,
} from './../../components/favorites/modal-favorite-list-button/modal-favorite-list-button.component';
import {
  ModalMainConfigButtonComponent,
} from './../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import { DiagramViewComponent } from './diagram-view.component';

describe('DiagramViewComponent', () => {
  let component: DiagramViewComponent;
  let fixture: ComponentFixture<DiagramViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DiagramViewComponent,
        ModalMainConfigButtonComponent,
        ModalFavoriteListButtonComponent
      ],
      imports: [
        MatDialogModule,
        HelgolandCoreModule,
        RouterTestingModule,
        MatMenuModule,
        TranslateTestingModule,
        MatSidenavModule,
        MatTooltipModule,
        NoopAnimationsModule,
        MatToolbarModule,
        HelgolandCommonModule,
        MatExpansionModule,
        MatIconModule,
        HelgolandFavoriteModule,
        MatBadgeModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
