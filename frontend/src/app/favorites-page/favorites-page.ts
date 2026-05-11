import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../services/favorite.service';
import { Navbar } from '../navbar/navbar';
import { RouterModule } from '@angular/router';
import { Recipecard } from '../recipecard/recipecard';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, Recipecard],
  templateUrl: './favorites-page.html',
  styleUrls: ['./favorites-page.css'],
})
export class FavoritesPage implements OnInit {
  private favoriteService = inject(FavoriteService);

  favorites: any[] = [];
  loading = true;

  ngOnInit() {
    this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        // Suodatetaan heti kättelyssä pois "orvot" suosikit
        // Pidetään vain ne, joilla on olemassa oleva recipe_id
        this.favorites = data.filter(
          (fav) => fav.recipe_id !== null && fav.recipe_id !== undefined,
        );
        this.loading = false;

        console.log('Suosikit ladattu, ehjiä reseptejä:', this.favorites.length);
      },
      error: (err) => {
        console.error('Error fetching favorites:', err);
        this.loading = false;
      },
    });
  }
  get favoriteCount(): number {
    return this.favorites.length;
  }
  handleRemoved(recipeId: string) {
    this.favorites = this.favorites.filter((fav) => {
      // Haetaan ID turvallisesti
      const currentRecipeId = fav.recipe_id?._id || fav.recipe_id;
      // Pidetään alkio vain jos se on olemassa JA se ei ole poistettava ID
      return currentRecipeId && currentRecipeId !== recipeId;
    });
  }
}
