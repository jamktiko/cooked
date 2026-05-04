import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-add.html',
  styleUrl: './recipe-add.css',
})
export class RecipeAdd {
  recipeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
  ) {
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      servings: [1, [Validators.min(1)]],
      duration: [0, [Validators.min(0)]],
      image: [''],
      public: [false],
      ingredients: this.fb.array([]),
      directions: this.fb.array([]),
      tags: this.fb.array([]),
    });

    // Alustetaan lomake yhdellä tyhjällä rivillä kutakin
    this.addIngredient();
    this.addDirection();
    this.addTag();
  }

  // --- GETTERIT ---
  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }
  get directions() {
    return this.recipeForm.get('directions') as FormArray;
  }
  get tags() {
    return this.recipeForm.get('tags') as FormArray;
  }

  // --- METODIT RIVIEN LISÄÄMISEEN ---
  addIngredient() {
    const ingredientForm = this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      unit: [''],
    });
    this.ingredients.push(ingredientForm);
  }

  addDirection() {
    this.directions.push(this.fb.control('', Validators.required));
  }

  addTag() {
    this.tags.push(this.fb.control(''));
  }

  // --- METODIT RIVIEN POISTAMISEEN ---
  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }
  removeDirection(index: number) {
    this.directions.removeAt(index);
  }
  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  // --- LÄHETYS ---
  onSubmit() {
    if (this.recipeForm.valid) {
      // 1. Otetaan kaikki data lomakkeelta
      const rawData = this.recipeForm.value;

      // 2. Siivotaan tyhjät pois (trim poistaa välilyönnit)
      const cleanedData = {
        ...rawData,
        // Pidetään vain ne, joissa on tekstiä
        tags: rawData.tags.filter((t: string) => t && t.trim() !== ''),
        directions: rawData.directions.filter((d: string) => d && d.trim() !== ''),
        ingredients: rawData.ingredients
          .filter((ing: any) => ing.name && ing.name.trim() !== '')
          .map((ing: any) => ({
            ...ing,
            name: ing.name.trim(),
            amount: Number(ing.amount),
          })),
      };

      console.log('Sending cleaned data:', cleanedData);

      this.recipeService.createRecipe(cleanedData).subscribe({
        next: (res) => {
          alert('Recipe created successfully!');
          this.router.navigate(['/frontpage']);
        },
        error: (err) => console.error('Error creating recipe:', err),
      });
    }
  }
}
