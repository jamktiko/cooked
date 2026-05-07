import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';

import { Recipecard } from '../recipecard/recipecard';

@Component({
  selector: 'app-swipe',
  standalone: true,
  imports: [CommonModule, Navbar, Recipecard],
  templateUrl: './swipe.html',
  styleUrl: './swipe.css',
})
export class Swipe implements OnInit {
  private router = inject(Router);
  private recipeService = inject(RecipeService);

  recipes: Recipe[] = [];
  currentIndex = 0;
  startX = 0;
  currentX = 0;
  isDragging = false;
  isAnimating = false;
  isLoading = true;

  ngOnInit() {
    this.fetchRecipes();
  }

  fetchRecipes() {
    this.isLoading = true;
    this.recipeService.getPublicRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load recipes', err);
        this.isLoading = false;
      },
    });
  }

  get currentRecipe() {
    return this.recipes[this.currentIndex];
  }

  get transformString() {
    const rotate = this.currentX * 0.05;
    return `translateX(${this.currentX}px) rotate(${rotate}deg)`;
  }

  startDrag(clientX: number) {
    if (this.isAnimating || this.isLoading || !this.currentRecipe) return;
    this.startX = clientX;
    this.isDragging = true;
  }

  moveDrag(clientX: number) {
    if (!this.isDragging) return;
    this.currentX = clientX - this.startX;
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const threshold = 80;

    if (this.currentX > threshold) this.handleMatch();
    else if (this.currentX < -threshold) this.handleSkip();
    else this.currentX = 0;
  }

  handleMatch() {
    this.isAnimating = true;
    this.currentX = 1000;
    setTimeout(() => {
      const matchedId = this.currentRecipe._id;
      this.nextCard();
      this.router.navigate(['/recipe', matchedId]);
    }, 300);
  }

  handleSkip() {
    this.isAnimating = true;
    this.currentX = -1000;
    setTimeout(() => this.nextCard(), 300);
  }

  nextCard() {
    this.currentX = 0;
    this.currentIndex++;
    this.isAnimating = false;
  }

  onTouchStart(e: TouchEvent) {
    this.startDrag(e.touches[0].clientX);
  }
  onTouchMove(e: TouchEvent) {
    this.moveDrag(e.touches[0].clientX);
  }
  onMouseDown(e: MouseEvent) {
    this.startDrag(e.clientX);
  }
  onMouseMove(e: MouseEvent) {
    this.moveDrag(e.clientX);
  }
}
