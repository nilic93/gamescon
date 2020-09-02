import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/auth.service';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

// TODO: Uncomment theese objects when implementation of dashboard and statistics pages is needed.
export const ROUTES: RouteInfo[] = [
  { path: 'home', title: 'Home', icon: 'ti-home', class: '' },
  { path: 'tetris', title: 'Tetris', icon: 'ti-tablet', class: '' },
  { path: 'customPayment', title: 'Results', icon: 'ti-book', class: '' }
];

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
  menuItems: any[];
  auth: AuthService;

  constructor(private authService: AuthService) {
    this.auth = authService;
    this.menuItems = ROUTES;
  }
}
