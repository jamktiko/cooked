import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  recipe: Recipe | undefined;
  loading = true;
  error = false;

  ngOnInit() {
    // 1. Haetaan ID URL-osoitteesta (esim. /recipe/65f123...)
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // 2. Kutsutaan serviceä
      this.recipeService.getRecipeById(id).subscribe({
        next: (data) => {
          this.recipe = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Haku epäonnistui', err);
          this.loading = false;
          this.error = true;
        },
      });
    }
  }
}
