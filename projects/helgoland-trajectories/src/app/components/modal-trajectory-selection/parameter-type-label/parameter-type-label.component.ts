import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ParameterType } from 'helgoland-common';

@Component({
  selector: 'helgoland-trajectories-parameter-type-label',
  templateUrl: './parameter-type-label.component.html',
  styleUrls: ['./parameter-type-label.component.scss'],
  imports: [CommonModule, TranslateModule],
  standalone: true,
})
export class ParameterTypeLabelComponent {
  @Input({ required: true })
  parameterType!: ParameterType;
}
