import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FavoriteTogglerComponent } from './favorite-toggler/favorite-toggler.component';
import { FavoriteService } from './service/favorite.service';

const COMPONENTS = [
  FavoriteTogglerComponent
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
    FavoriteService
  ]
})
export class HelgolandFavoriteModule {}
