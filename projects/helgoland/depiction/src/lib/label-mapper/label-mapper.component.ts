import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

import { LabelMapperService } from './label-mapper.service';

@Component({
  selector: 'n52-label-mapper',
  templateUrl: './label-mapper.component.html',
  styleUrls: ['./label-mapper.component.scss'],
  imports: [],
})
export class LabelMapperComponent implements OnChanges {
  protected labelMapperSrvc = inject(LabelMapperService);

  @Input()
  public label: string | undefined;

  public determinedLabel: string | undefined;

  public loading = true;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['label'] && this.label) {
      this.labelMapperSrvc.getMappedLabel(this.label).subscribe((label) => {
        this.determinedLabel = label;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }
}
