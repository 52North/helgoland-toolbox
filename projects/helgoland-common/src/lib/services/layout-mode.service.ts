import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutModeService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  private readonly dmClass = 'dark-theme';

  /**
   * Toggles the dark mode and returns if dark mode is currently active as boolean.
   * 
   * @returns {boolean} dark mode is active
   */
  toggleDarkMode(): boolean {
    const classList = this.document.body.classList
    if (classList.contains(this.dmClass)) {
      classList.remove(this.dmClass)
      return false
    } else {
      classList.add(this.dmClass)
      return true
    }
  }

  /**
   * Check, if dark mode is active.
   *
   *  @returns {boolean} dark mode
   */
  isDarkModeActive(): boolean {
    return this.document.body.classList.contains(this.dmClass);
  }

}
