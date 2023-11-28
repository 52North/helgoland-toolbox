import { Component } from "@angular/core";
import { PermalinkInMailComponent, PermalinkNewWindowComponent, PermalinkToClipboardComponent } from "@helgoland/permalink";


@Component({
  templateUrl: "./permalink.component.html",
  styleUrls: ["./permalink.component.scss"],
  imports: [
    PermalinkToClipboardComponent,
    PermalinkNewWindowComponent,
    PermalinkInMailComponent
  ],
  standalone: true
})
export class PermalinkComponent {

  public permalinkUrl = "test-url";

}
