import { Injectable } from "@angular/core";

@Injectable()
export class ColorService {

  /**
     * Creates a random color and return it as a hex string.
     */
  public getColor(): string {
    return this.getRandomColor();
  }

  /**
     * Converts a hex string and opacity in percent to RGBA color as string.
     */
  public convertHexToRGBA(hex: string, opacity: number): string {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
  }

  private getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
