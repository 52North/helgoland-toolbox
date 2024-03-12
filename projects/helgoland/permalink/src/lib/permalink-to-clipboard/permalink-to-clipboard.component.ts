import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClipboardModule } from "ngx-clipboard";

@Component({
  selector: "n52-permalink-to-clipboard",
  templateUrl: "./permalink-to-clipboard.component.html",
  standalone: true,
  imports: [ClipboardModule]
})
export class PermalinkToClipboardComponent {

  @Input({ required: true })
  public url!: string;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

}
