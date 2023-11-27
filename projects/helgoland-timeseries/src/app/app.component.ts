import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../helgoland-common/src/lib/components/header/header.component';

@Component({
  selector: 'helgoland-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  standalone: true
})
export class AppComponent {
  title = 'helgoland';
  fullscreen = true;
}
