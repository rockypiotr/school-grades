import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  template: ` <router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'school-grades';
}
