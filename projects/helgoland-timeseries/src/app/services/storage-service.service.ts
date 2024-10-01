import { Injectable } from '@angular/core';
import { LocalStorage } from '@helgoland/core';

const DATASET_ORDER = 'dataset-order';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private ids = new Set<string>();

  constructor(private localStorage: LocalStorage) {}

  loadOrder(): string[] {
    const list = this.localStorage.load(DATASET_ORDER);
    if (list instanceof Array) {
      return list as string[];
    } else {
      return [];
    }
  }

  saveDataset(dsId: string) {
    this.ids.add(dsId);
    this.save();
  }

  private save() {
    this.localStorage.save(DATASET_ORDER, Array.from(this.ids));
  }

  removeDataset(dsId: string) {
    this.ids.delete(dsId);
    this.save();
  }
}
