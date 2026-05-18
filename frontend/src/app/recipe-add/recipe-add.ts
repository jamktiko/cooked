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
<<<<<<< Updated upstream
  submitted = false;
=======
  isSubmitting = false;
  uploadedImageKey: string | null = null;
>>>>>>> Stashed changes

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
  get missingFields(): string[] {
    const fields = [];
    const controls = this.recipeForm.controls;

    // 1. Tarkistetaan reseptin nimi
    if (controls['name'].invalid) {
      fields.push('Recipe name (min. 3 characters)');
    }

    // 2. TARKISTETAAN AINESOSAT (Nimi ja määrä erikseen)
    let missingName = false;
    let invalidAmount = false;

    this.ingredients.controls.forEach((control) => {
      // Jos nimi on tyhjä
      if (control.get('name')?.invalid) {
        missingName = true;
      }
      // Jos määrä on tyhjä tai negatiivinen
      if (control.get('amount')?.invalid) {
        invalidAmount = true;
      }
    });

    if (missingName) {
      fields.push('Missing ingredient names');
    }
    if (invalidAmount) {
      fields.push('Ingredient amounts (must be 0 or greater)');
    }

    // 3. Tarkistetaan ohjeet
    let hasDirectionError = false;
    this.directions.controls.forEach((control) => {
      if (control.invalid) {
        hasDirectionError = true;
      }
    });
    if (hasDirectionError) {
      fields.push('Empty instruction steps');
    }

    // 4. Tarkistetaan annoskoko
    if (controls['servings'].invalid) {
      fields.push('Servings (must be at least 1)');
    }

    // 5. Tarkistetaan kuvaus
    if (controls['description'].invalid) {
      fields.push('Description is too long (max 1000 characters)');
    }

    return fields;
  }

  // --- METODIT RIVIEN LISÄÄMISEEN ---

  addIngredient() {
    const ingredientForm = this.fb.group({
      name: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
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
    this.uploadedImageKey = null; // Nollataan avain, jos käyttäjä valitsee uuden kuvan kesken kaiken
  }

  // --- LÄHETYS ---

  onSubmit() {
<<<<<<< Updated upstream
    this.submitted = true; // Lomaketta on nyt yritetty lähettää

    if (this.recipeForm.invalid) {
      // Merkitään kaikki kentät kosketetuiksi, jotta HTML-puolen virheet ja ring-reunustukset syttyvät
      this.recipeForm.markAllAsTouched();

      return; // Pysäytetään suoritus tähän, jos virheitä löytyy
    }
=======
    if (this.recipeForm.invalid || this.isSubmitting) return;
>>>>>>> Stashed changes

    this.isSubmitting = true;

    // 1. Jos kuva on jo ladattu S3:een (ja tallennetaan uudelleen virheen jälkeen)
    if (this.uploadedImageKey) {
      this.saveRecipe(this.uploadedImageKey);
      return;
    }

    // 2. Jos meillä on uusi kuva valittuna, mutta sitä ei ole vielä ladattu
    if (this.selectedFile) {
      this.uploadService.uploadProcess(this.selectedFile, 'recipes').subscribe({
        next: (res) => {
          this.uploadedImageKey = res.key; // Tallennetaan avain muistiin onnistuneen S3 latauksen jälkeen
          this.saveRecipe(res.key);
        },
        error: (err) => {
          console.error('Image upload failed', err);
          this.isSubmitting = false;
        },
      });
    } else {
      // 3. Ei kuvaa ollenkaan
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
      // Suodatetaan tyhjät nimet pois JA muunnetaan amount-merkkijono (esim. "0.5") varmasti oikeaksi numeroksi
      ingredients: rawData.ingredients
        .filter((ing: any) => ing.name && ing.name.trim() !== '')
        .map((ing: any) => ({
          ...ing,
          amount: ing.amount ? Number(String(ing.amount).replace(',', '.')) : 0,
        })),
    };

    this.recipeService.createRecipe(cleanedData).subscribe({
      next: (response) => {
        console.log('Recipe created:', response);
        this.isSubmitting = false;
        this.router.navigate(['/my-recipes']);
      },
      error: (err) => {
        console.error('Save failed', err);
        this.isSubmitting = false;
      },
    });
  }
}
