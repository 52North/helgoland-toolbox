import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorage } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-clear-storage-button',
  templateUrl: './clear-storage-button.component.html',
  styleUrls: ['./clear-storage-button.component.scss'],
  imports: [TranslateModule, MatButtonModule],
})
export class ClearStorageButtonComponent {
  localStorage = inject(LocalStorage);

  public clearAndReload() {
    this.localStorage.clearStorage();
    window.location.reload();
  }
}
