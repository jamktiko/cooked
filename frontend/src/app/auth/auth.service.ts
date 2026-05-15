// The purpose of the Auth service is to handle user login via the OIDC security service
// and perform authentication requests with user data to the backend so it can be stored
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

  // function to authenticate with the backend and create the user in the database if not present
  syncUserWithBackend() {
    // yhdistetään isAuthenticated ja userdata observablet jotta saadaan lähetettyä autentikaatio tokenin kanssa
    // user data for database
    combineLatest([
      this.oidcSecurityService.isAuthenticated$,
      this.oidcSecurityService.userData$,
    ]).subscribe(([authResult, userDataResult]) => {
      const isAuthenticated = authResult.isAuthenticated;
      const userData = userDataResult.userData;

      // check if authenticated (isAuthenticated)
      // check if user data has been returned (userData)
      if (isAuthenticated && userData) {
        // create a package that will be sent with the HTTP request to the backend
        const syncData = {
          cognitoId: userData.sub,
          email: userData.email,
        };

        console.log('Sending user to backend:', syncData);

        // and include the syncData packet (user sub, email, etc.)
        // send an HTTP request to backend /user/sync with the syncData
        this.http
          .post(`${environment.backendApi}/user/sync`, syncData)
          .pipe(delay(500), take(1)) // Pieni viive varmistaa, että token on varmasti valmis
          .subscribe({
            next: () => console.log('User synchronized!'),
            error: (err) => console.error('Error:', err),
          });
      }
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  // Add this signup() method under login()!
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
  // Logout function implemented this way because Cognito requires redirection to its own /logout endpoint
  // Using oidcSecurityService.logoff() may not properly redirect and end the session on the AWS side
  logout() {
    this.oidcSecurityService.logoffLocal();

    // IMPORTANT: This should read ...cognito.com/logout (not /login)
    const logoutUrl = `${environment.cognitoDomain}/logout?client_id=${environment.clientId}&logout_uri=${encodeURIComponent(environment.logoutUri)}`;

    window.location.href = logoutUrl;
  }
  //
  getAccessToken() {
    return this.oidcSecurityService.getAccessToken();
  }
}
