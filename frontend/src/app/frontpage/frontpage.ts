import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipecard } from '../recipecard/recipecard';
import { Navbar } from '../navbar/navbar';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { Search } from '../search/search';
import { SearchService } from '../services/search.service';
import { AuthService } from '../auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [CommonModule, Recipecard, Navbar, Search, RouterLink],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css',
})
export class Frontpage implements OnInit {
  private recipeService = inject(RecipeService);
  private searchService = inject(SearchService);
  public authService = inject(AuthService);

  isUserLoggedIn$ = this.authService.isLoggedIn$();
  
  // Variable to store recipes
  recipes: Recipe[] = [];

  // Pagination variables
  currentPage = 1;
  totalPages = 1;
  limit = 9;

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(page: number = 1): void {
    this.currentPage = page;
    // Call the service method
    this.recipeService.getPublicRecipes(this.currentPage, this.limit).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.recipes = data;
          this.totalPages = 1;
        } else {
          this.recipes = data.recipes || [];
          this.totalPages = data.totalPages || 1;
        }
        console.log('Recipes loaded:', data);
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
      },
    });
  }

  onPublicSearch(term: string) {
    if (term.length < 2) {
      // If search term is too short, reload default recipes
      this.loadRecipes(1);
      return;
    }

    // Performing public search
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
      // Small delay ensures new search results are loaded and
      // DOM updates before the browser tries to scroll to top.
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 50);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadRecipes(this.currentPage - 1);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 50);
    }
  }
}
