// src/app/login/login.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Tärkeä!
import { AuthService } from '../auth/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private oidcSecurityService = inject(OidcSecurityService); // Säilytetään nämä täällä UI:ta varten toistaiseksi

  isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
  userData$ = this.oidcSecurityService.userData$;

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      console.log('Käyttäjän tiedot:', userData);
    });
  }

  login() {
    console.log('Nappia painettu! Pyydetään redirectiä AWS:ään...');
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
