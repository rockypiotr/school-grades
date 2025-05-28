import { Component, OnInit } from '@angular/core';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import {
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatListItem,
    RouterLinkActive,
    MatListItemIcon,
    MatListItemTitle,
    MatIcon,
    RouterLink,
    MatSidenavContent,
    MatToolbar,
    RouterOutlet,
    MatIconButton,
    BreadcrumbComponent,
    NgOptimizedImage,
  ],
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  menus: any;

  ngOnInit(): void {
    this.setMenu();
  }

  private setMenu() {
    this.menus = [
      {
        title: 'Home',
        icon: 'dashboard',
        route: '/home',
      },
      {
        title: 'Configuration',
        icon: 'settings',
        route: '/configuration',
      },
    ];
  }
}
