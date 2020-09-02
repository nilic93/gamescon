import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';

import { ROUTES } from '../../../sidebar/sidebar.component';

@Component({
  moduleId: module.id,
  selector: 'navbar-cmp',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  public sidebarVisible: boolean;

  constructor(location: Location, private renderer: Renderer2, private element: ElementRef) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
  }

  getTitle() {
    const path = window.location.pathname;
    const splitted = path.split('/');

    const pathSegment = splitted[splitted.length - 1];
    const currentRoute = this.getRouteObject(pathSegment);

    return currentRoute ? currentRoute.title : 'GAMESCON';
  }

  getRouteObject(pathSegment) {
    return this.listTitles.find((route) => {
      return route.path === pathSegment
    })
  }

  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName('body')[0];

    if (this.sidebarVisible == false) {
      setTimeout(() => {
        toggleButton.classList.add('toggled');
      }, 500);
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }
}
