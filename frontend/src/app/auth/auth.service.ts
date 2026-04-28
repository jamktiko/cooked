// src/app/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { combineLatest } from 'rxjs';
import { delay, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private oidcSecurityService = inject(OidcSecurityService);
  private http = inject(HttpClient);

  // Määritä backendisi URL
  private apiUrl = 'http://localhost:3000/api/user'; // Muuta tarvittaessa reitti omasi mukaiseksi

  // Tämän metodin voi kutsua esim. AppComponentin ngOnInit:ssä,
  // jotta se lähtee aina käyntiin sovelluksen latautuessa.
  syncUserWithBackend() {
    // combineLatest yhdistää kaksi observablea ja kuuntelee niiden muutoksia
    combineLatest([
      this.oidcSecurityService.isAuthenticated$,
      this.oidcSecurityService.userData$,
    ]).subscribe(([authResult, userDataResult]) => {
      const isAuthenticated = authResult.isAuthenticated;
      const userData = userDataResult.userData;

      // Jos ollaan kirjauduttu ja Cognito on palauttanut ID Tokenin tiedot (userData)
      if (isAuthenticated && userData) {
        // Lähetetään backendille käyttäjän oleelliset tiedot ID tokenista.
        // cognito:username (tai sub) on yksilöllinen tunniste
        const syncData = {
          cognitoId: userData.sub,
          email: userData.email,
          name: userData.name || userData.preferred_username || userData.email,
        };

        console.log('Lähetetään käyttäjä backendille:', syncData);

        // jwt.interceptor hoitaa Access Tokenin lisäämisen tähän pyyntöön!
        // Sync-endpoint voi katsoa backendissa, löytyykö käyttäjä. Jos ei, luodaan uusi. Jos löytyy, päivitetään tiedot.
        this.http
          .post(`${this.apiUrl}/sync`, syncData)
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

  logout() {
    this.oidcSecurityService.logoffLocal();
    const cognitoDomain = 'https://eu-north-180236gypt.auth.eu-north-1.amazoncognito.com';
    const clientId = '3b6d5hg51lp4i1p1d97eibom9p';
    const logoutUri = 'http://localhost:4200';
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  }

  getAccessToken() {
    return this.oidcSecurityService.getAccessToken();
  }
}
