import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';
import { Uploadimg } from '../uploadimg/uploadimg';
import { Uploadservice } from '../services/uploadservice';
import { Navbar } from '../navbar/navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Uploadimg, Navbar, RouterLink],
  templateUrl: './recipe-add.html',
  styleUrl: './recipe-add.css',
})
export class RecipeAdd {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private uploadService = inject(Uploadservice);

  recipeForm: FormGroup;
  selectedFile: File | null = null;

  constructor() {
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      servings: [1, [Validators.min(1)]],
      duration: [0, [Validators.min(0)]],
      image: [''],
      public: [false],
      ingredients: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      directions: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      tags: this.fb.array([]),
    });

    this.addIngredient();
    this.addDirection();
    this.addTag();
  }
  blockMinus(event: KeyboardEvent) {
    const prohibitedKeys = ['-', 'e', 'E'];
    if (prohibitedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  onAmountInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    // Korvataan pilkku pisteellä
    let value = input.value.replace(',', '.');

    // Päivitetään arvo FormArrayhun
    this.ingredients.at(index).get('amount')?.setValue(value, { emitEvent: false });
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
    this.directions.markAsTouched();
  }
  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  onImageSelected(file: File) {
    this.selectedFile = file;
  }

  // --- LÄHETYS ---

  onSubmit() {
    if (this.recipeForm.invalid) return;

    if (this.selectedFile) {
      this.uploadService.uploadProcess(this.selectedFile, 'recipes').subscribe({
        next: (res) => {
          this.saveRecipe(res.key);
        },
        error: (err) => console.error('Image upload failed', err),
      });
    } else {
      this.saveRecipe();
    }
  }

  private saveRecipe(imageKey?: string) {
    console.log(imageKey + ' image key');
    const rawData = this.recipeForm.value;

    const cleanedData = {
      ...rawData,
      image: imageKey || '',
      tags: rawData.tags.filter((tag: string) => tag.trim() !== ''),
      directions: rawData.directions.filter((dir: string) => dir.trim() !== ''),
      ingredients: rawData.ingredients.filter((ing: any) => ing.name.trim() !== ''),
    };

    this.recipeService.createRecipe(cleanedData).subscribe({
      next: (response) => {
        console.log('Recipe created:', response);
        this.router.navigate(['/my-recipes']);
      },
      error: (err) => console.error('Save failed', err),
    });
  }
}
