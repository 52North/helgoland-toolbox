import { Component } from '@angular/core';
import { LocalStorage } from '@helgoland/core';

@Component({
  selector: 'helgoland-clear-storage-button',
  templateUrl: './clear-storage-button.component.html',
  styleUrls: ['./clear-storage-button.component.scss']
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
