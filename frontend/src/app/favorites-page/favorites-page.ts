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
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 50);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadFavorites(this.currentPage - 1);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 50);
    }
  }
  handleRemoved(recipeId: string) {
    // 1. Poistetaan kortti paikallisesti
    this.favorites = this.favorites.filter((fav) => fav.recipe_id?._id !== recipeId);

    // 2. Päivitetään laskuri
    if (this.totalCount > 0) this.totalCount--;

    // 3. Lasketaan uusi sivumäärä
    this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.limit));

    // 4. Jos sivu tyhjeni ja sivuja on vielä jäljellä (ollaan sivulla 2, 3...)
    if (this.favorites.length === 0 && this.currentPage > 1) {
      // Asetetaan loading päälle, jotta "No recipes" ei välmähdä ruudulla
      this.loading = true;
      this.loadFavorites(this.currentPage - 1);
    }
    // 5. Jos sivu jäi vajaaksi ja tiedämme että tietokannassa on vielä tavaraa
    else if (this.favorites.length < this.limit && this.totalCount >= this.limit) {
      this.loadFavorites(this.currentPage, true); // Silent load täyttää tyhjän paikan
    }
  }
}
