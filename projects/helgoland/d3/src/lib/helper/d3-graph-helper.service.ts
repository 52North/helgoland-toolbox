import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class D3GraphHelperService {

  constructor() { }

  /**
   * Function that returns the boundings of a html element.
   * @param el {Object} Object of the html element.
   */
  public getDimensions(el: any): { w: number, h: number } {
    let w = 0;
    let h = 0;
    if (el) {
      const dimensions = el.getBBox();
      w = dimensions.width;
      h = dimensions.height;
    } else {
      console.log('error: getDimensions() ' + el + ' not found.');
    }
    return {
      w,
      h
    };
  }

}
