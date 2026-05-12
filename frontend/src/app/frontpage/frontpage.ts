import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipecard } from '../recipecard/recipecard';
import { Navbar } from '../navbar/navbar';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { Search } from '../search/search';
import { SearchService } from '../services/search.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [CommonModule, Recipecard, Navbar, Search],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css',
})
export class Frontpage implements OnInit {
  private recipeService = inject(RecipeService);
  private searchService = inject(SearchService);
  public authService = inject(AuthService);

  isUserLoggedIn$ = this.authService.isLoggedIn$();
  
  // Muuttuja, johon reseptit tallennetaan
  recipes: Recipe[] = [];
  
  // Sivutuksen muuttujat
  currentPage = 1;
  totalPages = 1;
  limit = 9;

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(page: number = 1): void {
    this.currentPage = page;
    // Kutsutaan servicen metodia
    this.recipeService.getPublicRecipes(this.currentPage, this.limit).subscribe({
      next: (data) => {
        this.recipes = data.recipes;
        this.totalPages = data.totalPages;
        console.log('Recipes loaded:', data);
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
      },
    });
  }

  onPublicSearch(term: string) {
    if (term.length < 2) {
      // Jos hakukenttä on tyhjä, lataa käyttäjän kaikki reseptit normaalisti takaisin näkyviin
      this.loadRecipes(1);
      return;
    }

    // Nyt kutsutaan julkista hakua, ei privaattia!
    this.searchService.searchPublicRecipes(term).subscribe((response) => {
      // Korvataan näkymässä olevat "recipes" hauista löytyneillä
      this.recipes = response.recipes;
      // Search palauttaa myös sivutustietoja (jos valmiiksi toteutettu backendiin)
      this.currentPage = response.currentPage || 1;
      this.totalPages = response.totalPages || 1;
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadRecipes(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadRecipes(this.currentPage - 1);
    }
  }
}
