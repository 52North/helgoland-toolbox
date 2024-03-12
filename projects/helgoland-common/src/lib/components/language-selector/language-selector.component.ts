import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { LocalSelectorComponent } from "@helgoland/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "helgoland-common-language-selector",
  templateUrl: "./language-selector.component.html",
  styleUrls: ["./language-selector.component.scss"],
  imports: [
    CommonModule,
    MatSelectModule,
    TranslateModule
  ],
  standalone: true
})
export class LanguageSelectorComponent extends LocalSelectorComponent { }
