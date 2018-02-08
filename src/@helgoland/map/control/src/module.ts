import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@helgoland/core';
import { MapModule } from '@helgoland/map';

import { ExtentControlComponent } from './extent/extent.component';
import { GeosearchControlComponent } from './geosearch/geosearch.component';
import { LocateControlComponent } from './locate/locate.component';
import { LocateService } from './locate/locate.service';
import { ZoomControlComponent } from './zoom/zoom.component';

const COMPONENTS = [
  LocateControlComponent,
  ZoomControlComponent,
  GeosearchControlComponent,
  ExtentControlComponent
];

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    MapModule
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
    LocateService
  ]
})
export class MapControlModule { }
