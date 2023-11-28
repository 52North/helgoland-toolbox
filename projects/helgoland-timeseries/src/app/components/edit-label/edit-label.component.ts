import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "helgoland-edit-label",
  templateUrl: "./edit-label.component.html",
  styleUrls: ["./edit-label.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class EditLabelComponent implements AfterViewInit, OnInit {

  fc = new FormControl("");

  @Input() label: string | undefined;

  @Output() labelChanged: EventEmitter<string> = new EventEmitter();

  @ViewChild("input") firstItem!: ElementRef;

  editedLabel: string | undefined;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.editedLabel = this.label;
  }

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
