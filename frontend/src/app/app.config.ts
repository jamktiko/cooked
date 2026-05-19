// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LogLevel, provideAuth } from 'angular-auth-oidc-client';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { environment } from '../environments/environment';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),

    provideHttpClient(
      withInterceptors([jwtInterceptor]), // Tämä liittää tokenit automaattisesti pyyntöihin
    ),
    // cognitolle annettavat configuraatiot
    provideAuth({
      config: {
        authority: 'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Hn9USNBWY',
        redirectUrl: environment.redirectUrl,
        postLogoutRedirectUri: environment.redirectUrl,
        clientId: '31r3baig5pejtegiqopu61pt3',
        scope: 'openid email',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        historyCleanupOff: false,
        logLevel: LogLevel.Warn,
      },
    }),
  ],
};
