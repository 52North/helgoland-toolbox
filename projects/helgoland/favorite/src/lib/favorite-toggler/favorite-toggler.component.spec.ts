import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LocalStorage, NotifierService } from '@helgoland/core';

import { FavoriteService } from '../service/favorite.service';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { FavoriteTogglerComponent } from './favorite-toggler.component';

describe('FavoriteTogglerComponent', () => {
  let component: FavoriteTogglerComponent;
  let fixture: ComponentFixture<FavoriteTogglerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateTestingModule,
        FavoriteTogglerComponent,
      ],
      providers: [FavoriteService, LocalStorage, NotifierService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
