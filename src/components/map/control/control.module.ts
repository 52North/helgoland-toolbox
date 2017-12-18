import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HelgolandServicesModule } from './../../../services/services.module';
import { GeosearchControlComponent } from './geosearch/geosearch.component';
import { LocateControlComponent } from './locate/locate.component';
import { LocateService } from './locate/locate.service';
import { ZoomControlComponent } from './zoom/zoom.component';

const COMPONENTS = [
  LocateControlComponent,
  ZoomControlComponent,
  GeosearchControlComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HelgolandServicesModule
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
