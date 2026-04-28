import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs/operators';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Ohita kaikki AWS-pyynnöt
  if (
    req.url.includes('amazoncognito.com') ||
    req.url.includes('cognito-idp') ||
    req.url.includes('amazonaws.com')
  ) {
    return next(req);
  }

  // getAccessToken() palauttaa Observablen, joten käytetään rxjs:n switchMapia
  return authService.getAccessToken().pipe(
    switchMap((token) => {
      // console.log('interceptataan pyyntö urliin', req.url);

      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return next(req);
    })
  );
};