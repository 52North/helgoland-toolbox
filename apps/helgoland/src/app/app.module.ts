import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
