import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutModeService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  toggleDarkMode() {
    const classList = this.document.body.classList;
    const dmClass = 'dark-theme';
    if (classList.contains(dmClass)) {
      classList.remove(dmClass);
    } else {
      classList.add(dmClass);
    }
  }

}
