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
  totalCount = 0; // Kokonaismäärä suosikeille infotekstiä varten

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites(page: number = 1) {
    this.currentPage = page;
    this.loading = true;
    
    this.favoriteService.getFavorites(this.currentPage, this.limit).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          // Vanha fallback taulukolle
          this.favorites = data;
          this.totalPages = 1;
          this.totalCount = data.length;
        } else {
          // Uusi objektipohjainen muoto backendistä
          this.favorites = data.favorites || [];
          this.totalPages = data.totalPages || 1;
          this.totalCount = data.totalCount || this.favorites.length;
        }
        this.loading = false;

        console.log('Suosikit ladattu, ehjiä reseptejä:', this.favorites.length);
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

  get favoriteCount(): number {
    return this.totalCount; // Päivitetty palauttamaan tietokannan todellinen määrä, ei pelkän sivun!
  }
  
  handleRemoved(recipeId: string) {
    this.favorites = this.favorites.filter((fav) => fav.recipe_id._id !== recipeId);
    this.totalCount--; // Vähennetään suoraan lukumäärästä jotta UI pysyy ajan tasalla
    
    // Voit myös halutessasi hakea listan uusiksi tässä kohtaa,
    // jos poistat viimeisen elementin sivulta, esim:
    if (this.favorites.length === 0 && this.currentPage > 1) {
      this.loadFavorites(this.currentPage - 1);
    } else if (this.favorites.length < this.limit && this.totalPages > this.currentPage) {
       // Haetaan data uusiksi jotta sivu täyttyy seuraavan sivun ensimmäisellä itemillä
      this.loadFavorites(this.currentPage);
    }
  }
}
