import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent {

  @Input() public generatedUrlFunction: () => string;

  private readonly snackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'bottom',
    horizontalPosition: 'center'
  };

  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  public shareState() {
    const url = this.generatedUrlFunction();
    if (this.clipboard.copy(url)) {
      this.snackBar.open(this.translate.instant('permalink.copy-to-clipboard'), this.translate.instant('controls.ok'), this.snackBarConfig)
    } else {
      this.snackBar.open(this.translate.instant('permalink.copy-to-clipboard-error'), this.translate.instant('controls.ok'), this.snackBarConfig)
    }
  }

}
