import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(OidcSecurityService);

  // Ohita kaikki AWS-pyynnöt
  if (req.url.includes('amazoncognito.com') || 
      req.url.includes('cognito-idp') ||
      req.url.includes('amazonaws.com')) {
    return next(req);
  }

  const token = authService.getAccessToken();

  if (token && typeof token === 'string') {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};