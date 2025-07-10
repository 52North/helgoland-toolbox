import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'helgoland-edit-label',
  templateUrl: './edit-label.component.html',
  styleUrls: ['./edit-label.component.scss'],
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class EditLabelComponent implements AfterViewInit, OnInit {
  private cd = inject(ChangeDetectorRef);

  fc = new FormControl('');

  readonly label = input<string>();

  readonly labelChanged = output<string>();

  readonly firstItem = viewChild.required<ElementRef>('input');

  editedLabel: string | undefined;

  ngOnInit(): void {
    this.editedLabel = this.label();
  }

  ngAfterViewInit(): void {
    this.firstItem().nativeElement.focus();
    this.cd.detectChanges();
  }

  public changeLabel(updatedLabel: string) {
    this.editedLabel = updatedLabel;
  }

  public clear() {
    if (this.label() !== undefined) {
      this.labelChanged.emit(this.label()!);
    }
  }

  public confirm() {
    if (this.editedLabel) {
      this.labelChanged.emit(this.editedLabel);
    }
  }
}
