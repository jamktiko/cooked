import { Component, Input, OnInit } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
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

  isFavorite: boolean = false;
  loading: boolean = false;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    if (this.recipeId) {
      this.checkStatus();
    }
  }

  checkStatus() {
    this.favoriteService.checkStatus(this.recipeId).subscribe({
      next: (res) => (this.isFavorite = res.isFavorite),
      error: (err) => console.error('Virhe statuksessa:', err),
    });
  }

  toggle(event: Event) {
    event.stopPropagation(); // Estää kortin klikkaamisen, jos nappi on kortin sisällä

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
