import { NgClass } from '@angular/common';
import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  input,
  output,
} from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

@Component({
  selector: 'n52-refresh-button',
  templateUrl: './refresh-button.component.html',
  imports: [NgClass],
})
export class RefreshButtonComponent implements OnChanges, OnInit {
  protected settings = inject<SettingsService<Settings>>(SettingsService);

  readonly refreshInterval = input<number>();

  readonly toggled = input<boolean>();

  readonly refreshing = output<boolean>();

  private interval: number | undefined;

  ngOnInit(): void {
    if (!this.refreshInterval()) {
      const refreshDataInterval =
        this.settings.getSettings().refreshDataInterval;
      // this.refreshInterval = refreshDataInterval ? refreshDataInterval : 60;
    }
    this.evaluteRefreshing();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toggled']) {
      this.evaluteRefreshing();
    }
  }

  toggle() {
    const toggled = !this.toggled();
    if (toggled) {
      this.refresh();
    }
    this.evaluteRefreshing();
  }

  private evaluteRefreshing() {
    if (this.toggled()) {
      this.startRefreshInterval();
    } else {
      this.stopRefreshInterval();
    }
  }

  private startRefreshInterval() {
    this.interval = window.setInterval(
      () => this.refresh(),
      this.refreshInterval()! * 1000,
    );
  }

  private stopRefreshInterval() {
    clearInterval(this.interval);
  }

  private refresh() {
    this.refreshing.emit(true);
  }
}
