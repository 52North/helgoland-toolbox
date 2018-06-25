import { HttpClient } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatListModule, MatRadioModule, MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { HttpLoaderFactory } from './app.module';
import { LocalSelectorImplComponent } from './components/local-selector/local-selector.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSidenavModule,
        MatListModule,
        MatRadioModule,
        RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HelgolandCoreModule
      ],
      declarations: [
        AppComponent,
        LocalSelectorImplComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to helgoland-toolbox!');
  }));

});
