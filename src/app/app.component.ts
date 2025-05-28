import {Component} from '@angular/core';
import {
  GradingDashboardComponent
} from "./page/grading-system/components/grading-dashboard/grading-dashboard.component";

@Component({
  selector: 'app-root',
  imports: [GradingDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'school-grades';
}
