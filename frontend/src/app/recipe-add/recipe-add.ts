import { Component, inject } from '@angular/core';
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
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  // Lomakkeen pääryhmä
  recipeForm: FormGroup;

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

  // --- LÄHETYS ---
  onSubmit() {
    // Tarkistetaan, että kaikki pakolliset kentät on täytetty oikein
    if (this.recipeForm.valid) {
      // 1. Haetaan raakadata lomakkeelta
      const rawData = this.recipeForm.value;

      // 2. Datan siivous ennen lähetyksestä
      // Poistetaan tyhjät rivit ja trimataan ylimääräiset välilyönnit
      const cleanedData = {
        ...rawData,
        // Suodatetaan pois tyhjät tägit
        tags: rawData.tags.filter((t: string) => t && t.trim() !== ''),
        // Suodatetaan pois tyhjät ohjevaiheet
        directions: rawData.directions.map((d: string) => d.trim()).filter((d: string) => d !== ''),
        // Suodatetaan ainesosat, joilla ei ole nimeä, ja varmistetaan määrän numeerisuus
        ingredients: rawData.ingredients
          .filter((ing: any) => ing.name && ing.name.trim() !== '')
          .map((ing: any) => ({
            ...ing,
            name: ing.name.trim(),
            amount: Number(ing.amount),
          })),
      };

      console.log('Sending cleaned data:', cleanedData);

      // Kutsutaan palvelua reseptin tallentamiseksi
      this.recipeService.createRecipe(cleanedData).subscribe({
        next: (res) => {
          alert('Recipe created successfully!');
          // Ohjataan käyttäjä takaisin etusivulle onnistuneen tallennuksen jälkeen
          this.router.navigate(['/frontpage']);
        },
        error: (err) => {
          // Logataan virhe, jos tallennus epäonnistuu (esim. 401 tai 500 -virheet)
          console.error('Error creating recipe:', err);
        },
      });
    }
  }
}
