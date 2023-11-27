import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../helgoland-common/src/lib/components/header/header.component';

@Component({
  selector: 'helgoland-trajectories-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterModule,
    HeaderComponent
  ],
  standalone: true
})
export class AppComponent {
  title = 'helgoland-trajectories';
}
