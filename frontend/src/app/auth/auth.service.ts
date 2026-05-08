// Auth servicen tarkoitus on hoitaa oidc security servicen avulla käyttäjän kirjautuminen
// ja autentikaatio pyynnöt käyttäjädatan kanssa backendille jotta ne voidaan tallentaa kantaan
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { combineLatest } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private oidcSecurityService = inject(OidcSecurityService);
  private http = inject(HttpClient);

  // funktio backendin autentikointiin ja käyttäjän luontiin tietokantaan jos sitä ei siellä vielä ole
  syncUserWithBackend() {
    // yhdistetään isAuthenticated ja userdata observablet jotta saadaan lähetettyä autentikaatio tokenin kanssa
    // käyttäjätiedot tietokantaa varten
    combineLatest([
      this.oidcSecurityService.isAuthenticated$,
      this.oidcSecurityService.userData$,
    ]).subscribe(([authResult, userDataResult]) => {
      const isAuthenticated = authResult.isAuthenticated;
      const userData = userDataResult.userData;

      // katsotaan ollaanko kirjauduttu (isAuthenticated)
      // katsotaan onko käyttäjädata palautunut (userData)
      if (isAuthenticated && userData) {
        // luodaan paketti joka lähetetään http pyynnön yhteydessä backendille
        const syncData = {
          cognitoId: userData.sub,
          email: userData.email,
        };

        console.log('Lähetetään käyttäjä backendille:', syncData);

        // ja laittaa siihen mukaan syncData paketin eli käyttäjän subin spostin ja nimen
        // lähetetään http pyyntö backendin /sync polkuun ja lisätään siihen syncdata
        this.http
          .post(`${environment.backendApi}/user/sync`, syncData)
          .pipe(delay(500), take(1)) // Pieni viive varmistaa, että token on varmasti valmis
          .subscribe({
            next: () => console.log('Käyttäjä synkronoitu!'),
            error: (err) => console.error('Virhe:', err),
          });
      }
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  // Lisää tämä login() metodin alle!
  signup() {
    this.oidcSecurityService.authorize(undefined, {
      urlHandler: (url: string) => {
        // OIDC luo oletuksena turvallisen osoitteen: https://<cognito-domain>/oauth2/authorize?client_id=...&state=...
        // Vaihdetaan authorize-polku suoraan signup-poluksi, jotta päästään rekisteröitymään
        const finalSignupUrl = url.replace('/oauth2/authorize', '/signup');
        window.location.href = finalSignupUrl;
      },
    });
  }

  isLoggedIn$() {
    return this.oidcSecurityService.isAuthenticated$.pipe(map((result) => result.isAuthenticated));
  }
  // Logout funktio rakennettu näin koska cogniton vaatii ohjauksen sen omaan päätepisteeseen /logout?...
  // jos käyttää oidcSecurityService.logoff() metodia niin ohjausta ei toimi ja sessio ei kirjaudu ulos aws päädyssä
  logout() {
    this.oidcSecurityService.logoffLocal();

    // TÄRKEÄÄ: Tässä pitää lukea ...cognito.com/logout (eikä /login)
    const logoutUrl = `${environment.cognitoDomain}/logout?client_id=${environment.clientId}&logout_uri=${encodeURIComponent(environment.logoutUri)}`;

    window.location.href = logoutUrl;
  }
  //
  getAccessToken() {
    return this.oidcSecurityService.getAccessToken();
  }
}
