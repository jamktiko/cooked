import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ProfileupdateService } from '../services/profileupdate.service';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  loginUrl = environment.loginUrl;
  signupUrl = environment.signupUrl;

  authService = inject(AuthService);
  router = inject(Router);
  profileService = inject(ProfileupdateService);

  // Haetaan reaaliaikainen tieto kirjautumisesta (Observable)
  isUserLoggedIn$ = this.authService.isLoggedIn$();

  login() {
    this.authService.login();
  }

  signup() {
    this.authService.signup();
  }

  get isProfileActive(): boolean {
    return this.router.url.startsWith('/profile') || this.router.url.startsWith('/complete-profile');
  }

  goToProfile(event: Event) {
    event.preventDefault();
    this.profileService.getUser().subscribe({
      next: (user) => {
        if (user && user.isProfileComplete) {
          this.router.navigate(['/profile']);
        } else {
          this.router.navigate(['/complete-profile']);
        }
      },
      error: (err) => {
        console.error('Virhe profiilin tarkistuksessa:', err);
        // Jos tulee virhe, ohjataan silti profiiliin ettei navigointi mene täysin jumiin
        this.router.navigate(['/profile']);
      },
    });
  }
}
