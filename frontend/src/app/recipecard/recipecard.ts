import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe.model';
import { RouterModule, Router } from '@angular/router';
import { S3UrlPipe } from '../pipes/s3-url-pipe';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button';

@Component({
  selector: 'app-recipecard',
  standalone: true,
  imports: [CommonModule, RouterModule, S3UrlPipe, FavoriteButtonComponent],
  templateUrl: './recipecard.html',
  styleUrl: './recipecard.css',
})
export class Recipecard {
  private router = inject(Router);
  @Input() recipe!: Recipe;
  @Input() isOwnRecipe: boolean = false;
  @Input() canDelete: boolean = false;
  @Output() deleteRequest = new EventEmitter<string>();

  menuOpen = false;

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  requestDelete(event: Event) {
    event.stopPropagation();
    this.menuOpen = false;
    this.deleteRequest.emit(this.recipe._id);
  }

  goToEdit(event: Event) {
    event.stopPropagation();
    this.menuOpen = false;

    this.router.navigate(['/edit-recipe', this.recipe._id]);
  }
}
