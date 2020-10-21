import { Component } from '@angular/core';
import { LocalStorage } from '@helgoland/core';

@Component({
  selector: 'helgoland-toolbox-clear-storage',
  templateUrl: './clear-storage.component.html',
  styleUrls: ['./clear-storage.component.scss']
})
export class ClearStorageComponent {

  constructor(
    public localStorage: LocalStorage
  ) { }

  public clearAndReload() {
    this.localStorage.clearStorage();
    window.location.reload();
  }

}
