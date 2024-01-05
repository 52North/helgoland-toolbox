import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatasetType, HelgolandServicesConnector } from '@helgoland/core';
import {
  Favorite,
  FavoriteService,
  GroupFavorite,
  SingleFavorite,
} from '@helgoland/favorite';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { EditLabelComponent } from '../../edit-label/edit-label.component';
import { TimeseriesService } from './../../../services/timeseries-service.service';

interface EditableSingleFavorite extends SingleFavorite {
  editMode: boolean;
}

interface EditableGroupFavorite extends GroupFavorite {
  editMode: boolean;
}

@Component({
  selector: 'helgoland-modal-favorite-list',
  templateUrl: './modal-favorite-list.component.html',
  styleUrls: ['./modal-favorite-list.component.scss'],
  imports: [
    TranslateModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    EditLabelComponent,
  ],
  standalone: true,
})
export class ModalFavoriteListComponent implements OnInit {
  public singles: EditableSingleFavorite[] = [];
  public groups: EditableGroupFavorite[] = [];

  constructor(
    public favoriteSrvc: FavoriteService,
    public timeseriesSrvc: TimeseriesService,
    private servicesConnector: HelgolandServicesConnector,
    private translateSrvc: TranslateService,
  ) {}

  ngOnInit(): void {
    this.setFavorites();
  }

  public createGroup() {
    forkJoin(
      this.timeseriesSrvc.datasetIds.map((id) =>
        this.servicesConnector.getDataset(id, { type: DatasetType.Timeseries }),
      ),
    ).subscribe((datasets) => {
      const label =
        this.translateSrvc.instant('favorite.group-default-label') +
        ' ' +
        (this.favoriteSrvc.getFavoriteGroups().length + 1);
      const group = datasets.map((e) => ({
        dataset: e,
        options: this.timeseriesSrvc.datasetOptions.get(e.internalId)!,
      }));
      this.favoriteSrvc.addFavoriteGroup(group, label);
      this.setFavorites();
    });
  }

  public addSingleToDiagram(fav: SingleFavorite) {
    this.timeseriesSrvc.addDataset(fav.favorite.internalId);
  }

  public addGroupToDiagram(fav: GroupFavorite) {
    fav.favorites.forEach((e) =>
      this.timeseriesSrvc.addDataset(e.dataset.internalId),
    );
  }

  public deleteFav(fav: Favorite) {
    this.favoriteSrvc.removeFavorite(fav.id);
    this.setFavorites();
  }

  public setFavLabel(fav: Favorite, label: string) {
    this.favoriteSrvc.changeLabel(fav, label);
  }

  private setFavorites() {
    this.singles = this.favoriteSrvc.getFavorites().map((e) => {
      const t = e as EditableSingleFavorite;
      t.editMode = false;
      return t;
    });
    this.groups = this.favoriteSrvc.getFavoriteGroups().map((e) => {
      const t = e as EditableGroupFavorite;
      t.editMode = false;
      return t;
    });
  }
}
