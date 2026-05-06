import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe.model';
import { RouterModule } from '@angular/router';
import { S3UrlPipe } from '../pipes/s3-url-pipe';

@Component({
  selector: 'app-recipecard',
  standalone: true,
  imports: [CommonModule, RouterModule, S3UrlPipe],
  templateUrl: './recipecard.html',
  styleUrl: './recipecard.css',
})
export class Recipecard {
  @Input() recipe!: Recipe;
  @Input() isOwnRecipe: boolean = false;
}
