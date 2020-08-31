import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { AppModule } from "../../../app.module";
import { describe } from "selenium-webdriver/testing";


describe('FilterComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    window.history.pushState({}, 'Test Title', '/dashboard');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTitle()', () => {
    it('Should return Dashboard', () => {
      let result = component.getTitle();
      expect(result).toBe('Dashboard');
    });

    it('Should return Filter', () => {
      window.history.pushState({}, 'Test Title', '/filter');
      let result = component.getTitle();
      expect(result).toBe('Filter');
    });

    it('Should return Dashboard', () => {
      window.history.pushState({}, 'Test Title', '/filterfdsfsfs');
      let result = component.getTitle();
      expect(result).toBe('Dashboard');
    });
  });

  describe('sidebarToggle()', () => {
    it('Should set sidebarVisible to be false', () => {
      component.sidebarVisible = true;
      component.sidebarToggle();
      fixture.detectChanges();
      expect(component.sidebarVisible).toBe(false);
    })
    it('Should set sidebarVisible to be true', () => {
      component.sidebarVisible = false;
      component.sidebarToggle();
      fixture.detectChanges();
      jest.useFakeTimers();
      expect(component.sidebarVisible).toBe(true);
    })
  });
})
