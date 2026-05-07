import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { S3UrlPipe } from '../pipes/s3-url-pipe';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-recipe-detail',
  standalone: true,
  imports: [CommonModule, Navbar, S3UrlPipe, RouterLink],
  templateUrl: './my-recipe-detail.html',
  styleUrl: './my-recipe-detail.css',
})
export class MyRecipeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
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
  onDeleteRecipe(): void {
    const id = this.recipe?._id;
    if (!id) return;

    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        // Määritellään response tyypiksi 'any' tai luodaan sille interface
        next: (response: any) => {
          console.log('Delete successful:', response.message);
          this.router.navigate(['/my-recipes']);
        },
        // Määritellään err tyypiksi 'any'
        error: (err: any) => {
          console.error('Delete failed:', err);
          alert('Failed to delete the recipe due to a server error.');
        },
      });
    }
  }
}
