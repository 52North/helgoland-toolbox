import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {
  /**
   * Creates a random color and return it as a hex string.
   */
  getColor(): string {
    return this.getRandomColor();
  }

  /**
   * Converts a hex string and opacity in percent to RGBA color as string.
   */
  convertHexToRGBA(hex: string, opacity: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) throw new Error(`Ungültige Hex-Farbe: ${hex}`);
    const a = Math.round(Math.min(1, Math.max(0, opacity)) * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hex.replace(/^#/, '')}${a}`;
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    if (hex.length !== 6) return null;
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
