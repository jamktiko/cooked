// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAuth } from 'angular-auth-oidc-client';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { environment } from '../environments/environment';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([jwtInterceptor]), // Tämä liittää tokenit automaattisesti pyyntöihin
    ),

    provideAuth({
      config: {
        authority: 'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_80236Gypt',
        redirectUrl: window.location.origin + '/login',
        postLogoutRedirectUri: window.location.origin + '/login',
        clientId: '3b6d5hg51lp4i1p1d97eibom9p',
        scope: 'openid email profile',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
      },
    }),
  ],
};
