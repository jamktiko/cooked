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
    // Korvataan pilkku pisteellä
    let value = input.value.replace(',', '.');

    // Päivitetään arvo FormArrayhun
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

        // Use optional chaining ?. or an empty array || []
        // This prevents forEach from failing if data is missing
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

  // --- GETTERIT JA LISÄYS/POISTO (Samat kuin Add-komponentissa) ---
  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }
  get directions() {
    return this.recipeForm.get('directions') as FormArray;
  }
  get tags() {
    return this.recipeForm.get('tags') as FormArray;
  }

  addIngredient(data: any = { name: '', amount: 0, unit: '' }) {
    this.ingredients.push(
      this.fb.group({
        name: [data.name, Validators.required],
        amount: [data.amount, [Validators.required, Validators.min(0)]],
        unit: [data.unit],
      }),
    );
  }

  addDirection(value: string = '') {
    this.directions.push(this.fb.control(value, Validators.required));
  }

  addTag(value: string = '') {
    this.tags.push(this.fb.control(value));
  }

  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
  }
  removeDirection(i: number) {
    this.directions.removeAt(i);
  }
  removeTag(i: number) {
    this.tags.removeAt(i);
  }

  onImageSelected(file: File) {
    this.selectedFile = file;
  }

  onSubmit() {
    if (this.recipeForm.invalid) return;

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
      ingredients: rawData.ingredients.filter((i: any) => i.name?.trim()),
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
