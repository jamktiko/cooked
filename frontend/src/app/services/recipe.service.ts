import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environment';
import { PaginatedRecipes } from '../models/paginated-recipes';
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http = inject(HttpClient);

  private publicUrl = `${environment.backendApi}/recipes`;
  private apiUrl = `${environment.backendApi}/my-recipes`;

  // Hakee kaikki julkiset reseptit
  getPublicRecipes(page: number = 1, limit: number = 9): Observable<PaginatedRecipes> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedRecipes>(`${this.publicUrl}/all`, { params });
  }

  // Hakee yhden julkisen reseptin ID:llä (
  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.publicUrl}/${id}`);
  }

  // Hakee listan omina reseptejä
  getMyRecipes(page: number = 1, limit: number = 9): Observable<PaginatedRecipes> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedRecipes>(this.apiUrl, { params });
  }

  // Hakee yhden oman reseptin kaikki tiedot
  getMyRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  // Luo uuden reseptin, vaatii autentikoinnin
  createRecipe(recipeData: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/create`, recipeData);
  }

  // Päivittää olemassa olevan reseptin, vaatii autentikoinnin
  updateRecipe(id: string, recipeData: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/update/${id}`, recipeData);
  }

  // Poistaa reseptin, vaatii autentikoinnin
  deleteRecipe(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
