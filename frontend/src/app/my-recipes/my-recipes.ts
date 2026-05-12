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

  // Sivutuksen muuttujat
  currentPage = 1;
  totalPages = 1;
  limit = 9;
  totalCount = 0;

  ngOnInit(): void {
    this.loadRecipes();
  }
  
  loadRecipes(page: number = 1) {
    this.currentPage = page;
    this.loading = true;
    
    this.recipeService.getMyRecipes(this.currentPage, this.limit).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
           // Fallback jos backend palauttaa vielä taulukon
           this.myRecipes = data;
           this.totalPages = 1;
           this.totalCount = data.length;
        } else {
           // Kun backend on päivitetty oikein
           this.myRecipes = data.recipes || [];
           this.totalPages = data.totalPages || 1;
           this.totalCount = data.totalCount || this.myRecipes.length;
        }
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
      this.loadRecipes(1);
      return;
    }

    // Nyt kutsutaan privaattia hakua
    this.searchService.searchPrivateRecipes(term).subscribe((response) => {
      // Korvataan näkymässä olevat "recipes" hauista löytyneillä
      this.myRecipes = response.recipes;
      this.currentPage = response.currentPage || 1;
      this.totalPages = response.totalPages || 1;
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadRecipes(this.currentPage + 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadRecipes(this.currentPage - 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // Reseptin poisto
  onDeleteRecipe(id: string): void {
    if (confirm('Do you really want to delete this recipe?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: (response: any) => {
          console.log('Delete successful:', response.message);
          this.myRecipes = this.myRecipes.filter((r) => r._id !== id);
          this.totalCount--; // Vähennetään jotta numero pysyy oikeana HTML:ssä
          
          if (this.myRecipes.length === 0 && this.currentPage > 1) {
            this.loadRecipes(this.currentPage - 1);
          } else if (this.myRecipes.length < this.limit && this.totalPages > this.currentPage) {
            this.loadRecipes(this.currentPage);
          }
        },
        error: (err: any) => {
          console.error('Delete failed:', err);
          alert('Failed to delete the recipe due to a server error.');
        },
      });
    }
  }
}
