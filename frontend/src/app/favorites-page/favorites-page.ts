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

  loadFavorites(page: number = 1) {
    this.currentPage = page;
    this.loading = true;

    this.favoriteService.getFavorites(this.currentPage, this.limit).subscribe({
      next: (data: any) => {
        let rawList = [];

        if (Array.isArray(data)) {
          rawList = data;
          this.totalPages = 1;
          this.totalCount = data.length;
        } else {
          // backendin PaginatedRecipes rakenne: otetaan docs tai favorites -taulukko
          rawList = data.docs || data.favorites || [];
          this.totalPages = data.totalPages || 1;
          this.totalCount = data.totalCount || data.totalDocs || rawList.length;
        }

        // --- TÄRKEÄ KORJAUS: Suodatus tehdään taulukolle, ei objektille ---
        this.favorites = rawList.filter((fav: any) => fav.recipe_id && fav.recipe_id._id);

        // Päivitetään totalCount vastaamaan vain ehjiä kortteja, jos haluat UI:n täsmäävän
        if (this.favorites.length !== rawList.length) {
          const diff = rawList.length - this.favorites.length;
          this.totalCount -= diff;
        }

        this.loading = false;
        console.log('Suosikit ladattu, ehjiä reseptejä tällä sivulla:', this.favorites.length);
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
    // Käytetään valinnaista ketjutusta (?.), jotta null-arvot eivät kaada koodia
    this.favorites = this.favorites.filter((fav) => {
      const currentId = fav.recipe_id?._id;
      // Jos currentId on olemassa, verrataan sitä; jos ei, se suodattuu pois
      return currentId && currentId !== recipeId;
    });

    // Vähennetään laskuria vain, jos se on yli nollan
    if (this.totalCount > 0) {
      this.totalCount--;
    }

    // Sivun täyttölogiikka
    if (this.favorites.length === 0 && this.currentPage > 1) {
      this.loadFavorites(this.currentPage - 1);
    } else if (this.favorites.length === 0 && this.totalPages > 1) {
      // Jos sivu tyhjenee mutta sivuja on jäljellä, ladataan nykyinen sivu uudelleen
      this.loadFavorites(this.currentPage);
    }
  }
}
