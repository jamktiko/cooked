// src/app/login/login.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CommonModule } from '@angular/common'; // Tärkeä!

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private oidcSecurityService = inject(OidcSecurityService);

  isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;

  userData$ = this.oidcSecurityService.userData$;

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      console.log('Käyttäjän tiedot:', userData);
    });
  }

  login() {
    console.log('Nappia painettu! Pyydetään redirectiä AWS:ään...');
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe();
  }
}
