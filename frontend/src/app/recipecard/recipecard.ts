import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipecard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipecard.html',
  styleUrl: './recipecard.css',
})
export class Recipecard {
  @Input() recipe!: Recipe;
}
