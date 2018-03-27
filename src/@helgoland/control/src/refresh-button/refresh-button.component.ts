import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

@Component({
  selector: 'n52-refresh-button',
  templateUrl: './refresh-button.component.html'
})
export class RefreshButtonComponent implements OnChanges, OnInit {

  @Input()
  public refreshInterval: number;

  @Input()
  public toggled: boolean;

  @Output()
  public refreshing: EventEmitter<boolean> = new EventEmitter();

  private interval: NodeJS.Timer;

  public constructor(
    private settings: SettingsService<Settings>
  ) {
    if (!this.refreshInterval) {
      this.refreshInterval = this.settings.getSettings().refreshDataInterval
        ? this.settings.getSettings().refreshDataInterval : 60;
    }
  }

  public ngOnInit(): void {
    this.evaluteRefreshing();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.toggled) {
      this.evaluteRefreshing();
    }
  }

  public toggle() {
    this.toggled = !this.toggled;
    if (this.toggled) { this.refresh(); }
    this.evaluteRefreshing();
  }

  private evaluteRefreshing() {
    if (this.toggled) {
      this.startRefreshInterval();
    } else {
      this.stopRefreshInterval();
    }
  }

  private startRefreshInterval() {
    this.interval = setInterval(() => this.refresh(), this.refreshInterval * 1000);
  }

  private stopRefreshInterval() {
    clearInterval(this.interval);
  }

  private refresh() {
    this.refreshing.emit(true);
  }

}
