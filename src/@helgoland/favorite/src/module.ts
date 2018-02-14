import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FavoriteTogglerComponent } from './favorite-toggler/favorite-toggler.component';
import { FavoriteService } from './service/favorite.service';
import { JsonFavoriteExporterService } from './service/json-favorite-exporter.service';

const COMPONENTS = [
  FavoriteTogglerComponent
];

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
    FavoriteService,
    JsonFavoriteExporterService
  ]
})
export class HelgolandFavoriteModule { }
