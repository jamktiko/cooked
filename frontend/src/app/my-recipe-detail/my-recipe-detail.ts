import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-my-recipe-detail',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './my-recipe-detail.html',
  styleUrl: './my-recipe-detail.css',
})
export class MyRecipeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  recipe: Recipe | undefined;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getMyRecipeById(id).subscribe({
        next: (data) => {
          this.recipe = data;
        },
        error: (err) => {
          console.error('Error fetching my recipe:', err);
        },
      });
    }
  }
}
