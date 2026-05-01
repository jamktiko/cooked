import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Lisää HttpHeaders
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/my-recipes';

  constructor(private http: HttpClient) {}

  createRecipe(recipeData: Recipe): Observable<Recipe> {
    // 1. Hae token selaimen muistista
    // Tarkista, millä nimellä auth-kirjastosi tallentaa tokenin (esim. 'id_token' tai 'access_token')
    const token = localStorage.getItem('id_token');

    // 2. Luo headerit
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // 3. Lähetä pyyntö headereiden kanssa
    return this.http.post<Recipe>(`${this.apiUrl}/create`, recipeData, { headers });
  }
}
