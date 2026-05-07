import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Navbar],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor() {
    const oidcSecurityService = inject(OidcSecurityService);
    const router = inject(Router);

    oidcSecurityService.isAuthenticated$
      .pipe(takeUntilDestroyed())
      .subscribe(({ isAuthenticated }) => {
        if (isAuthenticated) {
          router.navigate(['/frontpage'], { replaceUrl: true });
        }
      });
  }
}
