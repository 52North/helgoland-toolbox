import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocateControlComponent } from './locate/locate.component';
import { LocateService } from './locate/locate.service';
import { ZoomControlComponent } from './zoom/zoom.component';

const COMPONENTS = [
  LocateControlComponent,
  ZoomControlComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
    LocateService
  ]
})
export class HelgolandMapControlModule {
}
