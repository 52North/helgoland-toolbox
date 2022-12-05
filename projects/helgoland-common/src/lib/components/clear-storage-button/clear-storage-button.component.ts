import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorage } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-clear-storage-button',
  templateUrl: './clear-storage-button.component.html',
  styleUrls: ['./clear-storage-button.component.scss'],
  imports: [
    TranslateModule,
    MatButtonModule,
  ],
  standalone: true
})
export class ClearStorageButtonComponent {

  constructor(
    public localStorage: LocalStorage
  ) { }

  public clearAndReload() {
    this.localStorage.clearStorage();
    window.location.reload();
  }

}
