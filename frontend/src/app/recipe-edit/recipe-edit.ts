import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Uploadimg } from '../uploadimg/uploadimg';
import { Uploadservice } from '../services/uploadservice';
import { Navbar } from '../navbar/navbar';
import { S3UrlPipe } from '../pipes/s3-url-pipe';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Uploadimg, Navbar, S3UrlPipe],
  templateUrl: './recipe-edit.html',
  styleUrl: './recipe-edit.css',
})
export class RecipeEdit implements OnInit {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private uploadService = inject(Uploadservice);

  recipeForm: FormGroup;
  recipeId: string | null = null;
  selectedFile: File | null = null;
  currentImageKey: string = '';
  submitted = false; // Seuraa onko Save-nappia painettu

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
  }

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.loadRecipeData();
    }
  }

  onAmountInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(',', '.');
    this.ingredients.at(index).get('amount')?.setValue(value, { emitEvent: false });
  }

  loadRecipeData() {
    this.recipeService.getMyRecipeById(this.recipeId!).subscribe({
      next: (recipe) => {
        this.currentImageKey = recipe.image || '';

        this.recipeForm.patchValue({
          name: recipe.name,
          description: recipe.description,
          servings: recipe.servings,
          duration: recipe.duration,
          public: recipe.public,
          image: recipe.image,
        });

        recipe.ingredients?.forEach((ing) => this.addIngredient(ing));
        recipe.directions?.forEach((dir) => this.addDirection(dir));
        recipe.tags?.forEach((tag) => this.addTag(tag));
      },
      error: (err) => {
        console.error('Error loading recipe', err);
        this.router.navigate(['/my-recipes']);
      },
    });
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

  get missingFields(): string[] {
    const fields = [];
    const controls = this.recipeForm.controls;

    if (controls['name'].invalid) {
      fields.push('Recipe name (min. 3 characters)');
    }

    let missingName = false;
    let invalidAmount = false;
    this.ingredients.controls.forEach((control) => {
      if (control.get('name')?.invalid) missingName = true;
      if (control.get('amount')?.invalid) invalidAmount = true;
    });

    if (missingName) fields.push('Missing ingredient names');
    if (invalidAmount) fields.push('Ingredient amounts (must be 0 or greater)');

    let hasDirectionError = false;
    this.directions.controls.forEach((control) => {
      if (control.invalid) hasDirectionError = true;
    });
    if (hasDirectionError) {
      fields.push('Empty instruction steps');
    }

    if (controls['servings'].invalid) {
      fields.push('Servings (must be at least 1)');
    }
    if (controls['duration'].invalid) {
      fields.push('Cooking time cannot be negative');
    }
    if (controls['description'].invalid) {
      fields.push('Description is too long (max 1000 characters)');
    }

    return fields;
  }

  // --- RIVIEN LISÄÄMINEN ---
  addIngredient(data: any = null) {
    const defaultName = data ? data.name : '';
    const defaultAmount = data ? data.amount : '';
    const defaultUnit = data ? data.unit : '';

    this.ingredients.push(
      this.fb.group({
        name: [defaultName, Validators.required],
        amount: [defaultAmount, [Validators.required, Validators.min(0)]],
        unit: [defaultUnit],
      }),
    );
  }

  addDirection(value: string = '') {
    this.directions.push(this.fb.control(value, Validators.required));
  }

  addTag(value: string = '') {
    this.tags.push(this.fb.control(value));
  }

  // --- RIVIEN POISTAMINEN ---
  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
    this.ingredients.markAsTouched();
  }
  removeDirection(i: number) {
    this.directions.removeAt(i);
    this.directions.markAsTouched();
  }
  removeTag(i: number) {
    this.tags.removeAt(i);
  }

  onImageSelected(file: File) {
    this.selectedFile = file;
  }

  // --- TALLENNUS JA LÄHETYS ---
  onSubmit() {
    this.submitted = true;

    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    if (this.selectedFile) {
      this.uploadService.uploadProcess(this.selectedFile, 'recipes').subscribe({
        next: (res) => this.updateRecipe(res.key),
        error: (err) => console.error('Image upload failed', err),
      });
    } else {
      this.updateRecipe(this.currentImageKey);
    }
  }

  private updateRecipe(imageKey: string) {
    const rawData = this.recipeForm.value;

    const cleanedData = {
      ...rawData,
      image: imageKey,
      tags: rawData.tags.filter((t: string) => t?.trim()),
      directions: rawData.directions.filter((d: string) => d?.trim()),
      // Puhdistetaan ainesosien amount-kentät merkkijonosta puhtaiksi numeroiksi bäkärille
      ingredients: rawData.ingredients
        .filter((i: any) => i.name?.trim())
        .map((ing: any) => ({
          ...ing,
          amount: ing.amount ? Number(String(ing.amount).replace(',', '.')) : 0,
        })),
    };

    this.recipeService.updateRecipe(this.recipeId!, cleanedData).subscribe({
      next: () => this.router.navigate(['/my-recipes']),
      error: (err) => console.error('Update failed', err),
    });
  }

  cancel(): void {
    this.router.navigate(['/my-recipes']);
  }
}
