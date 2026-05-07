import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth/auth.service'; // Tarkista polku oikeaksi!

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  loginUrl = environment.loginUrl;
  signupUrl = environment.signupUrl;

  authService = inject(AuthService);

  // Haetaan reaaliaikainen tieto kirjautumisesta (Observable)
  isUserLoggedIn$ = this.authService.isLoggedIn$();

  login() {
    this.authService.login();
  }
}
