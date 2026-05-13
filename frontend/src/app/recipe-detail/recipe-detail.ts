import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { Navbar } from '../navbar/navbar';
import { S3UrlPipe } from '../pipes/s3-url-pipe';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button';
@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, S3UrlPipe, FavoriteButtonComponent],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private location = inject(Location)
  recipe: Recipe | undefined;
  loading = true;
  error = false;

  // 1. Lisätään muuttuja klikattujen vaiheiden tallentamiseen
  completedSteps = new Set<number>();

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.recipeService.getRecipeById(id).subscribe({
        next: (data) => {
          this.recipe = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching recipe:', err);
          this.loading = false;
          this.error = true;
        },
      });
    }
  }
  // function to go back to the previous page
  goBack(): void {
    this.location.back();
  }
  // 2. Add function that handles clicks
  toggleStep(index: number) {
    if (this.completedSteps.has(index)) {
      this.completedSteps.delete(index);
    } else {
      this.completedSteps.add(index);
    }
  }
}
