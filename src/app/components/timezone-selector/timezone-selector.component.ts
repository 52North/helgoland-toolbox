import { Component, OnInit, inject } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TimezoneService } from '@helgoland/core';

@Component({
  selector: 'n52-timezone-selector',
  templateUrl: './timezone-selector.component.html',
  styleUrls: ['./timezone-selector.component.scss'],
  imports: [MatSelectModule],
})
export class TimezoneSelectorComponent implements OnInit {
  private timezoneSrvc = inject(TimezoneService);

  timezone: string | undefined;

  ngOnInit() {
    this.timezone = this.timezoneSrvc.getTimezoneName();
  }

  changeTimezone(msc: MatSelectChange) {
    this.timezoneSrvc.setTimezone(msc.value);
  }
}
