import { Component, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  host: {
    class: 'min-h-screen block',
    style:
      "background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url('/kuva.png'); background-size: cover; background-attachment: fixed; background-position: center;",
  },
})
export class AppComponent implements OnInit {
  private oidcSecurityService = inject(OidcSecurityService);
  private authService = inject(AuthService);

  ngOnInit() {
    // alustetaan tai käynnistetään oidcsecurityservice tarkistamalla onko käyttäjä autentikoitu
    this.oidcSecurityService.checkAuth().subscribe();

    // käynnistetään authservicestä tuleva sync funktio jotta voidaan autentikoida käyttäjä
    this.authService.syncUserWithBackend();
  }
}
