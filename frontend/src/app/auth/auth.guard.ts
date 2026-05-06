import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);

  return oidcSecurityService.isAuthenticated$.pipe(
    take(1), // Otetaan vain ensimmäinen tulos ja suljetaan virta
    map(({ isAuthenticated }) => {
      if (isAuthenticated) {
        return true;
      } else {
        // Jos ei olla kirjautuneita, ohjataan kirjautumissivulle (tai kutsutaan authorize())
        router.navigate(['/frontpage']);
        return false;
      }
    }),
  );
};
