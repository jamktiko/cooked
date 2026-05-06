import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() canDelete: boolean = false;
  @Output() deleteRequest = new EventEmitter<string>();

  menuOpen = false;

  toggleMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
    console.log('Valikon tila:', this.menuOpen);
  }

  requestDelete(event: Event) {
    event.stopPropagation();
    this.menuOpen = false;
    this.deleteRequest.emit(this.recipe._id);
  }
}
