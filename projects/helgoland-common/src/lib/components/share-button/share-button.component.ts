import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss'],
  imports: [MatIconModule, TranslateModule, MatTooltipModule, MatButtonModule],
})
export class ShareButtonComponent {
  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private liveAnnouncer = inject(LiveAnnouncer);

  readonly generatedUrlFunction = input<() => string>();

  private readonly snackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
  };

  shareState() {
    const generatedUrlFunction = this.generatedUrlFunction();
    if (generatedUrlFunction) {
      const url = generatedUrlFunction();
      if (this.clipboard.copy(url)) {
        this.inform(this.translate.instant('permalink.copy-to-clipboard'));
      } else {
        this.inform(
          this.translate.instant('permalink.copy-to-clipboard-error'),
        );
      }
    } else {
      throw new Error('generateUrlFunction is not defined');
    }
  }

  private inform(message: string) {
    this.liveAnnouncer.announce(message);
    this.snackBar.open(
      message,
      this.translate.instant('controls.ok'),
      this.snackBarConfig,
    );
  }
}
