import { Component, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  private oidcSecurityService = inject(OidcSecurityService);

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {
      console.log('Sovellus alustettu, kirjautumistila:', isAuthenticated);
      if (isAuthenticated) {
        console.log('Käyttäjän tiedot:', userData);
        console.log('Tokenisi on:', accessToken);
      }
    });
  }
}
