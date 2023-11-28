import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "helgoland-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [
    CommonModule,
    RouterModule
  ],
  standalone: true
})
export class AppComponent {
  title = "helgoland";
  fullscreen = true;
}
