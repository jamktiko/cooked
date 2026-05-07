import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { Recipecard } from '../recipecard/recipecard';
import { Navbar } from '../navbar/navbar';
import { S3UrlPipe } from '../pipes/s3-url-pipe';
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
  private searchService = inject(SearchService)
  myRecipes: Recipe[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadRecipes()
  }
  loadRecipes(){
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
  get recipeStats(): string {
    const count = this.myRecipes.length;
    if (count === 0) return '0 recipe';
    if (count === 1) return '1 recipe';
    return `${count} recipes`;
  }
    onPrivateSearch(term: string) {
  if (term.length < 2) {
     // Jos hakukenttä on tyhjä, lataa käyttäjän kaikki reseptit normaalisti takaisin näkyviin
     this.loadRecipes(); 
     return;
  }
  
  // Nyt kutsutaan julkista hakua, ei privaattia!
  this.searchService.searchPrivateRecipes(term).subscribe(response => {
    // Korvataan näkymässä olevat "recipes" hauista löytyneillä
    this.myRecipes = response.recipes; 
  });
}
}
