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

  // Fetch all public recipes
  getPublicRecipes(page: number = 1, limit: number = 9): Observable<PaginatedRecipes> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedRecipes>(`${this.publicUrl}/all`, { params });
  }

  // Fetch one public recipe by ID
  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.publicUrl}/${id}`);
  }

  // Get my recipes (paginated)
  getMyRecipes(page: number = 1, limit: number = 9): Observable<PaginatedRecipes> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedRecipes>(this.apiUrl, { params });
  }

  // Get one of my recipes by ID
  getMyRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  // Create a new recipe (requires authentication)
  createRecipe(recipeData: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/create`, recipeData);
  }

  // Update an existing recipe (requires authentication)
  updateRecipe(id: string, recipeData: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/update/${id}`, recipeData);
  }

  // Delete a recipe (requires authentication)
  deleteRecipe(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
