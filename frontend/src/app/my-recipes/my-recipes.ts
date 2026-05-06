import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { Recipecard } from '../recipecard/recipecard';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule, Recipecard, Navbar],
  templateUrl: './my-recipes.html',
  styleUrl: './my-recipes.css',
})
export class MyRecipes implements OnInit {
  private recipeService = inject(RecipeService);

  myRecipes: Recipe[] = [];
  loading = true;

  ngOnInit(): void {
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

  // Reseptien määrä
  get recipeStats(): string {
    const count = this.myRecipes.length;
    if (count === 0) return '0 recipe';
    if (count === 1) return '1 recipe';
    return `${count} recipes`;
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
