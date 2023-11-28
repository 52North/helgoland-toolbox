import { NgClass } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Settings, SettingsService } from "@helgoland/core";

@Component({
  selector: "n52-refresh-button",
  templateUrl: "./refresh-button.component.html",
  standalone: true,
  imports: [NgClass]
})
export class RefreshButtonComponent implements OnChanges, OnInit {

  @Input()
  public refreshInterval: number | undefined;

  @Input()
  public toggled: boolean | undefined;

  @Output()
  public refreshing: EventEmitter<boolean> = new EventEmitter();

  private interval: number | undefined;

  constructor(
    protected settings: SettingsService<Settings>
  ) { }

  public ngOnInit(): void {
    if (!this.refreshInterval) {
      const refreshDataInterval = this.settings.getSettings().refreshDataInterval;
      this.refreshInterval = refreshDataInterval ? refreshDataInterval : 60;
    }
    this.evaluteRefreshing();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["toggled"]) {
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
    this.interval = window.setInterval(() => this.refresh(), this.refreshInterval! * 1000);
  }

  private stopRefreshInterval() {
    clearInterval(this.interval);
  }

  private refresh() {
    this.refreshing.emit(true);
  }

}
