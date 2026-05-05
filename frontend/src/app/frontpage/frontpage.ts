import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipecard } from '../recipecard/recipecard';
import { Navbar } from '../navbar/navbar';
<<<<<<< HEAD
import { Uploadimg } from '../uploadimg/uploadimg';

@Component({
  selector: 'app-frontpage',
  imports: [Recipecard, Navbar, Uploadimg],
=======
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [CommonModule, Recipecard, Navbar],
>>>>>>> main
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css',
})
export class Frontpage implements OnInit {
  private recipeService = inject(RecipeService);

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
}
