import {
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
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

  public readonly label = input<string>();

  public determinedLabel: string | undefined;

  public loading = true;

  public ngOnChanges(changes: SimpleChanges): void {
    const labelValue = this.label();
    if (changes['label'] && labelValue) {
      this.labelMapperSrvc.getMappedLabel(labelValue).subscribe((label) => {
        this.determinedLabel = label;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }
}
