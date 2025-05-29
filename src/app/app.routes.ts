import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { GradingSystemComponent } from './components/grading-system/grading-system.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home' },
      },
      {
        path: 'configuration',
        component: GradingSystemComponent,
        data: { title: 'Grading system' },
      },
    ],
  },
];
