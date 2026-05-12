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
  // Muuttuja, johon reseptit tallennetaan
  recipes: Recipe[] = [];

  ngOnInit(): void {
    this.loadRecipes();
  }
  loadRecipes(): void {
    // Kutsutaan servicen metodia
    this.recipeService.getPublicRecipes().subscribe({
      next: (data) => {
        this.recipes = data;

        console.log('Recipes loaded:', this.recipes);
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
      },
    });
  }
  onPublicSearch(term: string) {
    if (term.length < 2) {
      // Jos hakukenttä on tyhjä, lataa käyttäjän kaikki reseptit normaalisti takaisin näkyviin
      this.loadRecipes();
      return;
    }

    // Nyt kutsutaan julkista hakua, ei privaattia!
    this.searchService.searchPublicRecipes(term).subscribe((response) => {
      // Korvataan näkymässä olevat "recipes" hauista löytyneillä
      this.recipes = response.recipes;
    });
  }
}
