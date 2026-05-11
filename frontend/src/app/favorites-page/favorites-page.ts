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
        this.favorites = data;
        this.loading = false;
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
    this.favorites = this.favorites.filter((fav) => fav.recipe_id._id !== recipeId);
  }
}
