import { Component } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-add',
  imports: [],
  templateUrl: './recipe-add.html',
  styleUrl: './recipe-add.css',
})
export class RecipeAdd {
  constructor(private recipeService: RecipeService) {}

  saveNewRecipe() {
    const newRecipe: Recipe = {
      title: 'Herkkupasta',
      ingredients: ['Pasta', 'Tomaatti'],
      instructions: 'Keitä ja sekoita.',
      image: 'kuva.jpg',
    };

    this.recipeService.createRecipe(newRecipe).subscribe({
      next: (response) => {
        console.log('Resepti tallennettu onnistuneesti!', response);
        // Tässä voit esim. ohjata käyttäjän listausnäkymään
      },
      error: (err) => {
        console.error('Tallennus epäonnistui:', err);
      },
    });
  }
}
