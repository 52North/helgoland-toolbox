import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'helgoland-edit-label',
  templateUrl: './edit-label.component.html',
  styleUrls: ['./edit-label.component.scss']
})
export class EditLabelComponent implements AfterViewInit {

  @Input() label: string;

  @Output() labelChanged: EventEmitter<string> = new EventEmitter();

  @ViewChild('input') firstItem: ElementRef;

  private editedLabel: string;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.firstItem.nativeElement.focus();
    this.cd.detectChanges();
  }

  public changeLabel(updatedLabel: string) {
    this.editedLabel = updatedLabel;
  }

  public clear() {
    this.labelChanged.emit(this.label);
  }

  public confirm() {
    this.labelChanged.emit(this.editedLabel);
  }

}
