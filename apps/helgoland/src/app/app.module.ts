import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DiagramViewComponent } from './components/diagram-view/diagram-view.component';

@NgModule({
  declarations: [AppComponent, DiagramViewComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '**',
        pathMatch: 'full',
        component: DiagramViewComponent
      }
    ], { initialNavigation: 'enabled' }),
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
