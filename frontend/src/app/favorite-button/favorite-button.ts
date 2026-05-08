import { Component, Input, OnInit, inject } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-button.html',
  styleUrls: ['./favorite-button.css'],
})
export class FavoriteButtonComponent implements OnInit {
  @Input() recipeId!: string;

  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  isFavorite: boolean = false;
  loading: boolean = false;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    // Tarkistetaan kirjautumisen tila
    this.authService.isLoggedIn$().subscribe((status) => {
      this.isLoggedIn = status;

      // Tarkistetaan suosikki-status vain, jos käyttäjä on sisällä
      if (this.isLoggedIn && this.recipeId) {
        this.checkStatus();
      }
    });
  }

  checkStatus() {
    this.favoriteService.checkStatus(this.recipeId).subscribe({
      next: (res) => (this.isFavorite = res.isFavorite),
      error: (err) => console.error('Virhe statuksessa:', err),
    });
  }

  toggle(event: Event) {
    event.stopPropagation();

    if (this.loading || !this.recipeId) return;

    this.loading = true;
    this.favoriteService.toggleFavorite(this.recipeId).subscribe({
      next: (res) => {
        this.isFavorite = res.isFavorite;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Virhe tallennuksessa:', err);
      },
    });
  }
}
