import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';
import { Uploadimg } from '../uploadimg/uploadimg';
import { Uploadservice } from '../services/uploadservice';

@Component({
  selector: 'app-recipe-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Uploadimg],
  templateUrl: './recipe-add.html',
  styleUrl: './recipe-add.css',
})
export class RecipeAdd {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private uploadService = inject(Uploadservice);

  // Lomakkeen pääryhmä
  recipeForm: FormGroup;
  selectedFile: File | null = null;

  constructor() {
    // Alustetaan lomakerakenne ja sen validointisäännöt
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required]], // Pakollinen kenttä
      description: [''],
      servings: [1, [Validators.min(1)]],
      duration: [0, [Validators.min(0)]],
      image: [''],
      public: [false],
      // FormArrayt dynaamisille listoille (ainesosat, vaiheet, tägit)
      ingredients: this.fb.array([]),
      directions: this.fb.array([]),
      tags: this.fb.array([]),
    });

    // Lisätään lomakkeelle heti kättelyssä yhdet tyhjät rivit käyttäjää varten
    this.addIngredient();
    this.addDirection();
    this.addTag();
  }

  // --- GETTERIT ---
  // Getterit helpottavat FormArray-kenttien käsittelyä HTML-templatessa
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

  // Lisää uuden ainesosaryhmän (nimi, määrä, yksikkö) listaan
  addIngredient() {
    const ingredientForm = this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      unit: [''],
    });
    this.ingredients.push(ingredientForm);
  }

  // Lisää uuden tekstikentän valmistusohjeille
  addDirection() {
    this.directions.push(this.fb.control('', Validators.required));
  }

  // Lisää uuden tekstikentän tägeille
  addTag() {
    this.tags.push(this.fb.control(''));
  }

  // --- METODIT RIVIEN POISTAMISEEN ---
  // Poistavat valitun rivin indeksin perusteella
  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }
  removeDirection(index: number) {
    this.directions.removeAt(index);
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
      // 1. Lataa kuva S3:een ensin
      this.uploadService.uploadProcess(this.selectedFile, 'recipes').subscribe({
        next: (res) => {
          this.saveRecipe(res.key);
        },
        error: (err) => console.error('Kuvan lataus epäonnistui', err),
      });
    } else {
      // Jos ei kuvaa, tallennetaan suoraan
      this.saveRecipe();
    }
  }

  private saveRecipe(imageKey?: string) {
    console.log(imageKey + 'tässä image key')
    const rawData = this.recipeForm.value;

    const cleanedData = {
      ...rawData,
      image: imageKey || '', // Tallennetaan vain key image-kenttään
      tags: rawData.tags.filter((tag: string) => tag.trim() !== ''),
      directions: rawData.directions.filter((dir: string) => dir.trim() !== ''),
      ingredients: rawData.ingredients.filter((ing: any) => ing.name.trim() !== ''),
    };

    this.recipeService.createRecipe(cleanedData).subscribe({
      next: (response) => {
        console.log('Resepti luotu:', response);
        this.router.navigate(['/frontpage']);
      },
      error: (err) => console.error('Tallennus epäonnistui', err),
    });
  }
}
