import { LiveAnnouncer } from "@angular/cdk/a11y";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FavoriteService, FavoriteTogglerComponent } from "@helgoland/favorite";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { NotifierService } from "../../../services/notifier.service";

@Component({
  selector: "helgoland-favorite-toggle-button",
  templateUrl: "./favorite-toggle-button.component.html",
  styleUrls: ["./favorite-toggle-button.component.scss"],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule
  ],
  standalone: true
})
export class FavoriteToggleButtonComponent extends FavoriteTogglerComponent {

  constructor(
    protected override favSrvc: FavoriteService,
    protected override translate: TranslateService,
    protected notifier: NotifierService,
    protected liveAnnouncer: LiveAnnouncer
  ) {
    super(favSrvc, translate);
  }

  protected override addFavorite() {
    super.addFavorite();
    this.inform(`${this.translate.instant("events.add-favorite")}: ${this.dataset.label}`);
  }

  protected override removeFavorite() {
    super.removeFavorite();
    this.inform(`${this.translate.instant("events.remove-favorite")}: ${this.dataset.label}`);
  }

  private inform(message: string) {
    this.liveAnnouncer.announce(message);
    this.notifier.notify(message);
  }

}
