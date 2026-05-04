import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environment.development'; // Huom: Tuotannossa Angular vaihtaa tämän automaattisesti

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // Määritellään muuttuja luokan ominaisuudeksi
  private apiUrl = `${environment.backendApi}/my-recipes`;

  constructor(private http: HttpClient) {}

  createRecipe(recipeData: Recipe): Observable<Recipe> {
    // 1. Hae token
    const token = localStorage.getItem('id_token');

    if (!token) {
      console.warn('No token found! User might be logged out.');
      // Tässä voisi myös heittää virheen (throwError), jotta komponentti saa tiedon
    }

    // 2. Luo headerit
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // 3. Lähetä pyyntö (käytä this.apiUrl)
    return this.http.post<Recipe>(`${this.apiUrl}/create`, recipeData, { headers });
  }
}
