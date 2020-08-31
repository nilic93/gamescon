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
  // { path: 'dashboard', title: 'Dashboard', icon: 'ti-panel', class: '' },
  // { path: 'statistics', title: 'Statistics', icon: 'ti-stats-up', class: '' }
  { path: 'findUser', title: 'Find user', icon: 'ti-user', class: '' },
  { path: 'episodes', title: 'Episodes', icon: 'ti-view-list-alt', class: '' },
  { path: 'filter', title: 'Filter', icon: 'ti-filter', class: '' },
  { path: 'payoutFiles', title: 'Payout files', icon: 'ti-files', class: '' },
  { path: 'customPayment', title: 'Custom payment', icon: 'ti-money', class: '' }
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
