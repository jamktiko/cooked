import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
  @Output() toggled = new EventEmitter<boolean>();

  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  isFavorite: boolean = false;
  loading: boolean = false;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.authService.isLoggedIn$().subscribe((status) => {
      this.isLoggedIn = status;

      if (this.isLoggedIn && this.recipeId) {
        this.checkStatus();
      }
    });
  }

  checkStatus() {
    this.favoriteService.checkStatus(this.recipeId).subscribe({
      next: (res) => (this.isFavorite = res.isFavorite),
      error: (err) => console.error('Error in status', err),
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
        this.toggled.emit(this.isFavorite);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error in saving:', err);
      },
    });
  }
}
