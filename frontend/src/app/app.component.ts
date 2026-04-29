import { Component, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
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
