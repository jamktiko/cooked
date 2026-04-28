import { Component, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  private oidcSecurityService = inject(OidcSecurityService);
  private authService = inject(AuthService);

  ngOnInit() {
    // 1. Angular-auth-oidc-clientin vaatima juurialustus
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {
      console.log('Sovellus alustettu, kirjautumistila:', isAuthenticated);
      if (isAuthenticated) {
        console.log('Käyttäjän tiedot:', userData);
        console.log('Tokenisi on:', accessToken);
      }
    });

    // 2. Käynnistetään taustakuuntelija (kuuntelee kirjautumistilan muutoksia ja synkkaa backendille)
    this.authService.syncUserWithBackend();
  }
}
