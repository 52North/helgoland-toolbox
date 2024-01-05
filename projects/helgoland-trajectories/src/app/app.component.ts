import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'helgoland-trajectories-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule],
  standalone: true,
})
export class AppComponent {
  title = 'helgoland-trajectories';
}
