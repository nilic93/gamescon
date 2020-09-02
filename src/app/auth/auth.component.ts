import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'auth-cmp',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  auth: AuthService;

  constructor(private authService: AuthService, private router: Router) {
    this.auth = authService;
  }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

}
