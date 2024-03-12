import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParsedTimespanPreset, Required, Settings, SettingsService, Timespan, TimespanPreset } from '@helgoland/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'n52-predefined-timespan-selector',
  templateUrl: './predefined-timespan-selector.component.html',
  styleUrls: ['./predefined-timespan-selector.component.scss'],
  standalone: true,
  imports: [NgClass]
})

export class PredefinedTimespanSelectorComponent implements OnInit {

  @Input()
  @Required
  public timespan!: Timespan;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTimespanChange: EventEmitter<Timespan> = new EventEmitter<Timespan>();

  public parsedTimespanPresets: ParsedTimespanPreset[] = [];

  constructor(
    protected settingSrvc: SettingsService<Settings>
  ) { }

  public ngOnInit() {
    const timespanPresets = this.settingSrvc.getSettings().timespanPresets;
    if (timespanPresets) {
      this.parsedTimespanPresets = timespanPresets
        .filter((e) => this.isSafeTimespanPreset(e))
        .map((e) => {
          const from = this.parseMomentExpression(e.timespan.from);
          const to = this.parseMomentExpression(e.timespan.to);
          if (from && to) {
            return {
              name: e.name,
              label: e.label,
              timespan: {
                from: from.getTime(),
                to: to.getTime()
              },
              seperatorAfterThisItem: e.seperatorAfterThisItem
            };
          }
          throw new Error("Could not parse timespan");
        });
    }
  }

  public isSafeMomentExpression(expression: string): boolean {
    /* eslint-disable max-len */
    // regex checks whether code to be eval'ed adhers to syntax given in https://momentjs.com/docs/#/manipulating/
    // explanation:               Start with "moment()"   Possible functions: add(number, string) and subtract(number, string)                            Further possible functions: startOf(string) and endOf(string)                           Further possible functions: year(number), ..., milliseconds(number).                         functions can be chained infinitely, or not at all
    // further explanation:       This is a MUST.         The strings have to be out of the options described in the docs (shortcuts permitted)           Again, the strings have to be out of a strict set.                                      These set the corresponding part of the Moment object to the number given.                   |  (i.e. "moment()" is the minimal case matched)
    // even further explanation:                          The number doesn't HAVE to be reasonable (e.g. month=20 is ok), but that's no security issue.   The quotes can incorrectly start with ' and then end with " (or vice versa), but that's no security problem either.                                                                  v v optional semicolon at the end
    const safeMomentExpression = new RegExp(/^moment\(\)(\.(((add|subtract)\(\d+, ?['"](years|y|quarters|Q|months|M|weeks|w|days|d|hours|h|minutes|m|seconds|s|milliseconds|ms)['"]\))|((startOf|endOf)\(['"](year|month|quarter|week|isoWeek|day|date|hour|minute|second)['"]\))|((year|month|date|hours|minutes|seconds|milliseconds)\(\d+\))))*;?$/);
    // brackets level in case you get lost:          * *1  234            4 *          4                                                                                      4     *3 34             4 *    4                                                           4     *3 34                                                  4 *    *321
    // * = this bracket is an escaped bracket and therefore not counted

    // test expression against regex above
    return safeMomentExpression.test(expression);
  }

  public isSafeTimespanPreset(preset: TimespanPreset): boolean {
    // test both inputs against the regex
    const isSafe = this.isSafeMomentExpression(preset.timespan.from) && this.isSafeMomentExpression(preset.timespan.to);

    if (isSafe) {
      return true;
    } else {
      console.log('Timespan preset "' + preset.name + '" has invalid moment() expression!');
      return false;
    }
  }

  public parseMomentExpression(expression: string): Date | null {
    // just to be sure not to eval() something nasty
    if (this.isSafeMomentExpression(expression)) {
      // if satisfied, eval the inputs -> the ._d property contains the corresponding Date objects from which the Timespan can be constructed
      // eslint-disable-next-line no-eval
      return eval(expression)._d;
    }
    return null;
  }

  public timespanChanged(preset: ParsedTimespanPreset) {
    // construct new Timespan
    this.timespan = new Timespan(preset.timespan.from, preset.timespan.to);
    // publicise new timespan
    this.onTimespanChange.emit(this.timespan);
  }
}
