import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { Recipecard } from '../recipecard/recipecard';
import { Navbar } from '../navbar/navbar';
import { Search } from '../search/search';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule, Recipecard, Navbar, Search],
  templateUrl: './my-recipes.html',
  styleUrl: './my-recipes.css',
})
export class MyRecipes implements OnInit {
  private recipeService = inject(RecipeService);
  private searchService = inject(SearchService);
  myRecipes: Recipe[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadRecipes();
  }
  loadRecipes() {
    this.recipeService.getMyRecipes().subscribe({
      next: (data) => {
        this.myRecipes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching my recipes:', err);
        this.loading = false;
      },
    });
  }

  onPrivateSearch(term: string) {
    if (term.length < 2) {
      // Jos hakukenttä on tyhjä, lataa käyttäjän kaikki reseptit normaalisti takaisin näkyviin
      this.loadRecipes();
      return;
    }

    // Nyt kutsutaan julkista hakua, ei privaattia!
    this.searchService.searchPrivateRecipes(term).subscribe((response) => {
      // Korvataan näkymässä olevat "recipes" hauista löytyneillä
      this.myRecipes = response.recipes;
    });
  }

  // Reseptin poisto
  onDeleteRecipe(id: string): void {
    if (confirm('Do you really want to delete this recipe?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: (response: any) => {
          console.log('Delete successful:', response.message);
          this.myRecipes = this.myRecipes.filter((r) => r._id !== id);
        },
        error: (err: any) => {
          console.error('Delete failed:', err);
          alert('Failed to delete the recipe due to a server error.');
        },
      });
    }
  }
}
