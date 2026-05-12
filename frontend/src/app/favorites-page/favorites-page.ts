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

  // Sivutuksen muuttujat
  currentPage = 1;
  totalPages = 1;
  limit = 9;
  totalCount = 0;

  ngOnInit() {
    // Kutsutaan loadFavorites heti alussa, ei kirjoiteta logiikkaa kahdesti
    this.loadFavorites(1);
  }

  loadFavorites(page: number = 1, silent: boolean = false) {
    this.currentPage = page;
    if (!silent) this.loading = true;

    this.favoriteService.getFavorites(this.currentPage, this.limit).subscribe({
      next: (data: any) => {
        let rawList = data.docs || data.favorites || [];
        this.totalPages = data.totalPages || 1;
        this.totalCount = data.totalCount || data.totalDocs || rawList.length;

        // Suodatetaan haamut
        this.favorites = rawList.filter((fav: any) => fav.recipe_id && fav.recipe_id._id);

        // Jos haamuja löytyi, korjataan totalCount
        if (this.favorites.length !== rawList.length) {
          const diff = rawList.length - this.favorites.length;
          this.totalCount -= diff;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching favorites:', err);
        this.loading = false;
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadFavorites(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadFavorites(this.currentPage - 1);
    }
  }

  handleRemoved(recipeId: string) {
    this.favorites = this.favorites.filter((fav) => fav.recipe_id?._id !== recipeId);
    if (this.totalCount > 0) this.totalCount--;

    if (this.favorites.length < this.limit && this.totalCount >= this.limit) {
      // Kutsutaan SILENT-latausta
      this.loadFavorites(this.currentPage, true);
    } else if (this.favorites.length === 0 && this.currentPage > 1) {
      this.loadFavorites(this.currentPage - 1);
    }
  }
}
