import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'helgoland-toolbox-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent implements OnInit {

  @Input() progressBarPosition: 'top' | 'bottom';

  constructor() { }

  ngOnInit(): void {
  }

  @HostBinding('style.align-items') get alignItems() {
    switch (this.progressBarPosition) {
      case 'top':
        return 'flex-start';
      default:
        return 'flex-end';
    }
  }

}
