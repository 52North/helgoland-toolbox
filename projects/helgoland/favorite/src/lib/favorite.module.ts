import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FavoriteTogglerComponent } from './favorite-toggler/favorite-toggler.component';
import { FavoriteService } from './service/favorite.service';
import { JsonFavoriteExporterService } from './service/json-favorite-exporter.service';

const COMPONENTS = [FavoriteTogglerComponent];

/**
 * The favorite module includes the following functionality:
 * - favorite service to handle favorites
 * - toggler component so activate a favorite
 * - import/export serivce
 */
@NgModule({
  imports: [CommonModule, COMPONENTS],
  exports: [COMPONENTS],
  providers: [FavoriteService, JsonFavoriteExporterService],
})
export class HelgolandFavoriteModule {}
